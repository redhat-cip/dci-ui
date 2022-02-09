import { sortByOldestFirst } from "services/sort";
import { IComponentCoverageESData, IJobStatus } from "types";

export interface IComponentCoverage {
  id: string;
  name: string;
  nbOfSuccessfulJobs: number;
  nbOfJobs: number;
  topic_id: string;
  jobs: { id: string; created_at: string; status: IJobStatus }[];
}

interface ComponentsCoverage {
  [componentId: string]: IComponentCoverage;
}

export function buildComponentCoverage(data: IComponentCoverageESData | null) {
  if (data === null) return {} as ComponentsCoverage;
  return data.hits.reduce((acc, d) => {
    const componentId = d._source.component_id;
    const componentStats = acc[componentId] || {
      id: componentId,
      name: d._source.component_name,
      nbOfSuccessfulJobs: 0,
      nbOfJobs: 0,
      topic_id: d._source.topic_id,
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
  }, {} as ComponentsCoverage);
}

export function getComponentCoverageDomain(coverage: ComponentsCoverage) {
  return Object.values(coverage).reduce(
    (acc, component) => {
      if (component.nbOfJobs > acc.nbOfJobs.max) {
        acc.nbOfJobs.max = component.nbOfJobs;
      }
      if (component.nbOfSuccessfulJobs > acc.nbOfSuccessfulJobs.max) {
        acc.nbOfSuccessfulJobs.max = component.nbOfSuccessfulJobs;
      }
      return acc;
    },
    {
      nbOfJobs: { min: 0, max: 0 },
      nbOfSuccessfulJobs: { min: 0, max: 0 },
    } as {
      nbOfJobs: { min: number; max: number };
      nbOfSuccessfulJobs: { min: number; max: number };
    }
  );
}
