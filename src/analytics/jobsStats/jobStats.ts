import {
  FinalJobStatuses,
  IAnalyticsJob,
  IFinalJobStatus,
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";
import {
  t_global_color_status_danger_default,
  t_global_color_status_warning_default,
  t_global_color_status_success_default,
} from "@patternfly/react-tokens";
import { getPrincipalComponent } from "topics/component/componentSelector";

export const groupByKeys = ["topic", "pipeline", "component"] as const;
export type IGroupByKey = (typeof groupByKeys)[number];
export const groupByKeysWithLabel: Record<IGroupByKey, string> = {
  topic: "Topic name",
  pipeline: "Pipeline name",
  component: "Component name",
};

export type IJobStat = Record<
  IFinalJobStatus,
  {
    color: string;
    total: number;
    label: string;
  }
>;

function getJobKey(job: IAnalyticsJob, groupByKey: IGroupByKey) {
  let key: string | null = null;

  switch (groupByKey) {
    case "topic":
      key = job.topic.name;
      break;
    case "pipeline":
      if (job.pipeline !== null) {
        key = job.pipeline.name;
      }
      break;
    case "component":
      key = getPrincipalComponent(job.components)?.display_name || null;
      break;
    default:
      const exhaustiveCheck: never = groupByKey;
      throw new Error(`Unhandled groupByKey: ${exhaustiveCheck}`);
  }
  return key;
}

export function getJobStats(
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse,
  groupByKey: IGroupByKey,
): Record<string, IJobStat> {
  const emptyJobStat = {} as Record<string, IJobStat>;
  try {
    if (Object.keys(data).length === 0) {
      return emptyJobStat;
    }
    return data.hits.hits.reduce(
      (acc, hit) => {
        const jobStatus = hit._source.status;
        if (!(FinalJobStatuses as readonly string[]).includes(jobStatus))
          return acc;
        const key = getJobKey(hit._source, groupByKey);
        if (key === null) return acc;
        const finalJobStatus = jobStatus as IFinalJobStatus;
        const stat = acc[key] || {
          success: {
            color: t_global_color_status_success_default.var,
            total: 0,
            label: "Successful jobs",
          },
          failure: {
            color: t_global_color_status_danger_default.var,
            total: 0,
            label: "Failed jobs",
          },
          error: {
            color: t_global_color_status_danger_default.var,
            total: 0,
            label: "Errored jobs",
          },
          killed: {
            color: t_global_color_status_warning_default.var,
            total: 0,
            label: "Killed jobs",
          },
        };
        stat[finalJobStatus].total += 1;
        acc[key] = stat;
        return acc;
      },
      {} as Record<string, IJobStat>,
    );
  } catch (error) {
    return emptyJobStat;
  }
}
