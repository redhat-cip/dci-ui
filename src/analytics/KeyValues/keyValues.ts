import { DateTime } from "luxon";
import { IAnalyticsJob } from "types";
import {
  IGraphBackColor,
  IGraphType,
  IKeyValueGraph,
  hashStringToGraphBackgroundColor,
} from "./keyValuesTypes";
import { getJobKey } from "analytics/analyticsJob";

function generateKey(key1: string, key2: string): string {
  return `${key1}_${key2}`
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function extractKeys(data: IAnalyticsJob[]): string[] {
  try {
    if (Object.keys(data).length === 0) {
      return [];
    }
    return data.reduce((acc, job) => {
      const keyValues = job.keys_values;
      for (let i = 0; i < keyValues.length; i++) {
        const keyValue = keyValues[i];
        const key = keyValue.key;
        if (acc.indexOf(key) === -1) {
          acc.push(key);
        }
      }
      return acc;
    }, [] as string[]);
  } catch (error) {
    return [];
  }
}

interface IGraphKeysValuesKey {
  color: IGraphBackColor;
  label: string;
  key: string;
  graphType: IGraphType;
  axis: "left" | "right";
}

interface IGraphKeysValuesData {
  id: string;
  name: string;
  created_at: number;
  keysValues: {
    [key: string]: number;
  };
}

interface IGraphKeysValuesYAxis {
  orientation: "left" | "right";
  label: string;
  color: IGraphBackColor;
}

export interface IGraphKeysValues {
  keys: IGraphKeysValuesKey[];
  data: IGraphKeysValuesData[];
  yAxis: IGraphKeysValuesYAxis[];
}

const emptyKeyValuesGraph: IGraphKeysValues = {
  yAxis: [],
  keys: [],
  data: [],
};

export function extractKeysValues(
  graph: IKeyValueGraph,
  data: IAnalyticsJob[],
): IGraphKeysValues {
  try {
    if (Object.keys(data).length === 0) {
      return {
        ...emptyKeyValuesGraph,
      };
    }
    const kv = data.reduce(
      (acc, job) => {
        const jobId = job.id;
        const jobName = job.name;
        const createdAt = DateTime.fromISO(job.created_at).toMillis();
        const d: IGraphKeysValuesData = {
          id: jobId,
          name: jobName,
          created_at: createdAt,
          keysValues: {},
        };
        for (let i = 0; i < graph.keys.length; i++) {
          const graphKey = graph.keys[i];
          let key = graphKey.key;
          let color = graphKey.color;
          let label = key;
          acc.yAxis[graphKey.axis] = {
            orientation: graphKey.axis,
            label,
            color,
          };
          const matchingKeyValue = job.keys_values.find(
            (keyValue) => keyValue.key === key,
          );
          if (!matchingKeyValue) continue;
          if (graph.group_by !== "") {
            const groupByKey = getJobKey(job, graph.group_by);
            if (groupByKey) {
              label = `${key} - ${groupByKey}`;
              key = generateKey(key, groupByKey);
              color = hashStringToGraphBackgroundColor(key);
            }
          }
          acc.keys[key] = {
            key,
            label,
            color,
            graphType: graph.graphType,
            axis: graphKey.axis,
          };
          d.keysValues[key] = matchingKeyValue.value;
        }
        acc.data.push(d);
        return acc;
      },
      {
        yAxis: {},
        keys: {},
        data: [],
      } as {
        yAxis: Record<string, IGraphKeysValuesYAxis>;
        keys: { [key: string]: IGraphKeysValuesKey };
        data: IGraphKeysValuesData[];
      },
    );
    return {
      yAxis: Object.values(kv.yAxis),
      keys: Object.values(kv.keys).sort((key1, key2) => {
        if (key1.label < key2.label) {
          return -1;
        }
        if (key1.label > key2.label) {
          return 1;
        }
        return 0;
      }),
      data: kv.data.sort((a, b) => a.created_at - b.created_at),
    };
  } catch (error) {
    return { ...emptyKeyValuesGraph };
  }
}
