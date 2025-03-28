import { FinalJobStatuses, IAnalyticsJob, IFinalJobStatus } from "types";
import {
  t_global_color_status_danger_default,
  t_global_color_status_warning_default,
  t_global_color_status_success_default,
} from "@patternfly/react-tokens";
import { getPrincipalComponent } from "topics/component/componentSelector";

export const groupByKeys = [
  "topic",
  "pipeline",
  "component",
  "name",
  "remoteci",
  "team",
  "configuration",
] as const;
export type IGroupByKey = (typeof groupByKeys)[number];
export const groupByKeysWithLabel: Record<IGroupByKey, string> = {
  topic: "Topic name",
  pipeline: "Pipeline name",
  component: "Component name",
  name: "Job name",
  team: "Team name",
  remoteci: "Remoteci name",
  configuration: "Configuration",
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
    case "name":
      key = job.name;
      break;
    case "remoteci":
      key = job.remoteci.name;
      break;
    case "team":
      key = job.team.name;
      break;
    case "configuration":
      key = job.configuration;
      break;
    default:
      const exhaustiveCheck: never = groupByKey;
      throw new Error(`Unhandled groupByKey: ${exhaustiveCheck}`);
  }
  return key;
}

export function getJobStats(
  data: IAnalyticsJob[],
  groupByKey: IGroupByKey,
): Record<string, IJobStat> {
  const emptyJobStat = {} as Record<string, IJobStat>;
  try {
    if (data.length === 0) {
      return emptyJobStat;
    }
    return data.reduce(
      (acc, job) => {
        const jobStatus = job.status;
        if (!(FinalJobStatuses as readonly string[]).includes(jobStatus))
          return acc;
        const key = getJobKey(job, groupByKey);
        if (key === null || key === "") return acc;
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
