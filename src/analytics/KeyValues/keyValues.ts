import { DateTime } from "luxon";
import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
  IGraphKeyValues,
} from "types";

export function extractKeyValues(
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse,
): IGraphKeyValues {
  try {
    if (Object.keys(data).length === 0) {
      return {};
    }
    return data.hits.hits.reduce((acc, hit) => {
      const created_at = DateTime.fromISO(hit._source.created_at).toMillis();
      const keyValues = hit._source.keys_values;
      const job_id = hit._source.id;
      const job_name = hit._source.name;
      for (let i = 0; i < keyValues.length; i++) {
        const keyValue = keyValues[i];
        const key = keyValue.key;
        const value = keyValue.value;
        const tmpKeyValues = acc[key] ?? [];
        tmpKeyValues.push({
          created_at,
          value,
          job: {
            id: job_id,
            name: job_name,
          },
          key,
        });
        acc[key] = tmpKeyValues;
      }
      return acc;
    }, {} as IGraphKeyValues);
  } catch (error) {
    return {};
  }
}
