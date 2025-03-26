import { getPrincipalComponent } from "topics/component/componentSelector";
import { IAnalyticsJob, IGroupByKey } from "types";

export function getJobKey(job: IAnalyticsJob, groupByKey: IGroupByKey) {
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
