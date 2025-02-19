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

const emptyKeyValuesGraph: IGraphKeysValues = {
  keys: [],
  data: [],
  groupByKeys: {
    name: [],
    status: [],
    team: [],
    topic: [],
    pipeline: [],
  },
};

function generateKey(key1: string, key2: string): string {
  return `${key1}_${key2}`
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function associate(keys1: Set<string>, keys2: string[]): string[] {
  return keys2.flatMap((key2) =>
    Array.from(keys1)
      .filter((key1) => key1 !== "")
      .map((key1) => generateKey(key1, key2)),
  );
}

export function extractKeysValues(
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse,
): IGraphKeysValues {
  try {
    if (Object.keys(data).length === 0) {
      return { ...emptyKeyValuesGraph };
    }
    const kv = data.hits.hits.reduce(
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
        const jobStatus = hit._source.status;
        const teamName = hit._source.team.name;
        const topicName = hit._source.topic.name;
        const pipelineName = hit._source.pipeline?.name || "";

        const keyValues = hit._source.keys_values;
        for (let i = 0; i < keyValues.length; i++) {
          const keyValue = keyValues[i];
          const key = keyValue.key;
          const value = keyValue.value;
          if (acc.keys.indexOf(key) === -1) {
            acc.keys.push(key);
          }
          d.keysValues[key] = value;
          d.keysValues[generateKey(jobName, key)] = value;
          d.keysValues[generateKey(jobStatus, key)] = value;
          d.keysValues[generateKey(teamName, key)] = value;
          d.keysValues[generateKey(topicName, key)] = value;
          if (pipelineName) {
            d.keysValues[generateKey(pipelineName, key)] = value;
          }
        }
        acc.data.push(d);
        acc.groupByKeys.name.add(jobName);
        acc.groupByKeys.status.add(jobStatus);
        acc.groupByKeys.team.add(teamName);
        acc.groupByKeys.topic.add(topicName);
        acc.groupByKeys.pipeline.add(pipelineName);
        return acc;
      },
      {
        ...emptyKeyValuesGraph,
        groupByKeys: {
          name: new Set<string>(),
          status: new Set<string>(),
          team: new Set<string>(),
          topic: new Set<string>(),
          pipeline: new Set<string>(),
        },
      },
    );
    return {
      ...kv,
      groupByKeys: {
        name: associate(kv.groupByKeys.name, kv.keys),
        status: associate(kv.groupByKeys.status, kv.keys),
        team: associate(kv.groupByKeys.team, kv.keys),
        topic: associate(kv.groupByKeys.topic, kv.keys),
        pipeline: associate(kv.groupByKeys.pipeline, kv.keys),
      },
    };
  } catch (error) {
    return { ...emptyKeyValuesGraph };
  }
}
