import { DateTime } from "luxon";
import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
  IJobKeysValues,
  IGraphKeysValues,
} from "types";

type DateRange = {
  after: string;
  before: string;
};

export function getTicksInRange(range: DateRange): number[] {
  const afterDate = DateTime.fromISO(range.after);
  const beforeDate = DateTime.fromISO(range.before);
  if (afterDate > beforeDate) {
    throw new Error(
      "The 'after' date must be before or equal to the 'before' date.",
    );
  }
  const ticks: number[] = [];
  let currentDate = afterDate;
  while (currentDate <= beforeDate) {
    ticks.push(currentDate.toMillis());
    currentDate = currentDate.plus({ days: 1 });
  }
  return ticks;
}

export function extractKeysValues(
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse,
): IGraphKeysValues {
  try {
    if (Object.keys(data).length === 0) {
      return { keys: [], data: [] };
    }
    return data.hits.hits.reduce(
      (acc, hit) => {
        const jobId = hit._source.id;
        const jobName = hit._source.name;
        const createdAt = DateTime.fromISO(hit._source.created_at).toMillis();
        const d: IJobKeysValues = {
          id: jobId,
          name: jobName,
          created_at: createdAt,
          keysValues: {},
        };
        const keyValues = hit._source.keys_values;
        for (let i = 0; i < keyValues.length; i++) {
          const keyValue = keyValues[i];
          const key = keyValue.key;
          const value = keyValue.value;
          if (acc.keys.indexOf(key) === -1) {
            acc.keys.push(key);
          }
          d.keysValues[key] = value;
        }
        acc.data.push(d);
        return acc;
      },
      { keys: [], data: [] } as IGraphKeysValues,
    );
  } catch (error) {
    return { keys: [], data: [] };
  }
}
