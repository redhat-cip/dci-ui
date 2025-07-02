import { sortByOldestFirst } from "services/sort";
import type { IComponentCoverage, IAnalyticsJob } from "types";

type IComponentCoverageById = {
  [componentId: string]: IComponentCoverage;
};

export function buildComponentCoverage(
  data: IAnalyticsJob[],
): IComponentCoverage[] {
  try {
    if (Object.keys(data).length === 0) {
      return [];
    }
    const initialAccumulator: IComponentCoverageById = {};
    const components = data.reduce((acc, job) => {
      const components = job.components;
      for (let i = 0; i < components.length; i++) {
        const component = components[i];
        const componentId = component.id;
        const componentStats = acc[componentId] || {
          id: componentId,
          display_name: component.display_name,
          type: component.type,
          nbOfSuccessfulJobs: 0,
          nbOfJobs: 0,
          topic_id: component.topic_id,
          tags: job.tags,
          jobs: [],
        };
        componentStats.nbOfJobs += 1;
        if (job.status === "success") {
          componentStats.nbOfSuccessfulJobs += 1;
        }
        componentStats.jobs.push({
          id: job.id,
          name: job.name,
          created_at: job.created_at,
          status: job.status,
        });
        acc[componentId] = componentStats;
      }
      return acc;
    }, initialAccumulator);
    return Object.values(components).map((c) => ({
      ...c,
      jobs: sortByOldestFirst(c.jobs),
    }));
  } catch {
    return [];
  }
}
