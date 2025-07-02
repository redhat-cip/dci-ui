import { DateTime } from "luxon";
import type { IAnalyticsResultsJob, IJobStatus } from "types";

export interface IPipelineJob {
  id: string;
  name: string;
  status: IJobStatus;
  status_reason: string;
  components: { id: string; topic_id: string; display_name: string }[];
  comment: string;
  datetime: DateTime;
  results: {
    errors: number;
    failures: number;
    success: number;
    skips: number;
    total: number;
  };
  duration: number;
}

interface IPipeline {
  id: string;
  name: string;
  created_at: string;
  jobs: IPipelineJob[];
}

export interface IPipelineDay {
  date: string;
  datetime: DateTime;
  pipelines: IPipeline[];
}

export function extractPipelinesFromAnalyticsJobs(
  data: IAnalyticsResultsJob[],
): IPipelineDay[] {
  if (data.length === 0) {
    return [];
  }
  const daysMap: {
    [key: string]: {
      date: string;
      datetime: DateTime;
      pipelines: {
        [key: string]: IPipeline;
      };
    };
  } = {};
  [...data].reverse().forEach((job) => {
    if (job.pipeline === null) return;
    const pipelineDate = job.pipeline.created_at.split("T")[0];

    if (!daysMap[pipelineDate]) {
      daysMap[pipelineDate] = {
        date: pipelineDate,
        datetime: DateTime.fromISO(pipelineDate),
        pipelines: {},
      };
    }

    const pipelineId = job.pipeline.id;

    if (!daysMap[pipelineDate].pipelines[pipelineId]) {
      daysMap[pipelineDate].pipelines[pipelineId] = {
        id: pipelineId,
        name: job.pipeline.name,
        created_at: job.pipeline.created_at,
        jobs: [],
      };
    }
    daysMap[pipelineDate].pipelines[pipelineId].jobs.push({
      id: job.id,
      name: job.name,
      datetime: DateTime.fromISO(job.created_at),
      status: job.status,
      status_reason: job.status_reason || "",
      components: job.components,
      comment: job.comment || "",
      results: (job.results || []).reduce(
        (acc, result) => {
          acc.errors += result.errors;
          acc.failures += result.failures;
          acc.success += result.success;
          acc.skips += result.skips;
          acc.total += result.total;
          return acc;
        },
        {
          errors: 0,
          failures: 0,
          success: 0,
          skips: 0,
          total: 0,
        },
      ),
      duration: job.duration,
    });
  });
  return Object.values(daysMap)
    .map((day) => ({
      ...day,
      pipelines: Object.values(day.pipelines),
    }))
    .sort((day1, day2) => {
      const epoch1 = day1.datetime.toMillis();
      const epoch2 = day2.datetime.toMillis();
      return epoch1 < epoch2 ? 1 : epoch1 > epoch2 ? -1 : 0;
    });
}
