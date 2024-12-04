import { sortByOldestFirst } from "services/sort";
import { IComponentCoverageESData, IComponentCoverage } from "types";

export function buildComponentCoverage(data: IComponentCoverageESData | null) {
  if (data === null) return [];
  const components = data.hits.reduce(
    (acc, d) => {
      const componentId = d._source.id;
      const componentStats = acc[componentId] || {
        id: componentId,
        display_name: d._source.display_name,
        type: d._source.type,
        nbOfSuccessfulJobs: 0,
        nbOfJobs: 0,
        topic_id: d._source.topic_id,
        tags: d._source.tags,
        jobs: sortByOldestFirst([
          ...d._source.success_jobs.map((j) => ({ ...j, status: "success" })),
          ...d._source.failed_jobs.map((j) => ({ ...j, status: "failure" })),
        ]),
      };
      componentStats.nbOfSuccessfulJobs += d._source.success_jobs.length;
      componentStats.nbOfJobs +=
        d._source.success_jobs.length + d._source.failed_jobs.length;
      acc[componentId] = componentStats;
      return acc;
    },
    {} as {
      [componentId: string]: IComponentCoverage;
    },
  );
  return Object.values(components);
}
