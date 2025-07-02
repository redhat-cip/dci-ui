import { getPrincipalComponent } from "topics/component/componentSelector";
import type { IAnalyticsJob, IGroupByKey } from "types";

export function getJobKey<T extends IAnalyticsJob>(
  job: T,
  groupByKey: IGroupByKey,
) {
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
    case "url":
      key = job.url;
      break;
    case "status":
      key = job.status;
      break;
    case "status_reason":
      key = job.status_reason;
      break;
    case "comment":
      key = job.comment;
      break;
    case "tags":
      key = job.tags.join("|");
      break;
    default: {
      const exhaustiveCheck: never = groupByKey;
      throw new Error(`Unhandled groupByKey: ${exhaustiveCheck}`);
    }
  }
  return key;
}
