import { DateTime } from "luxon";
import { api } from "api";

interface IKeyValue {
  job_id: string;
  key: string;
  value: number;
}
export type IKeyValueEmptyResponse = string[];

export interface IKeyValueResponse {
  _shards: {
    failed: number;
    skipped: number;
    successful: number;
    total: number;
  };
  hits: {
    hits: [
      {
        _id: string;
        _index: string;
        _score: number | null;
        _source: {
          id: string;
          name: string;
          created_at: string;
          keys_values: IKeyValue[];
        };
        _type: string;
        sort: string[];
      },
    ];
    max_score: number | null;
    total: {
      relation: string;
      value: number;
    };
  };
  timed_out: boolean;
  took: number;
}

export interface IGraphKeyValue {
  created_at: number;
  value: number;
  key: string;
  job: {
    id: string;
    name: string;
  };
}

interface IGraphKeyValues {
  [key: string]: IGraphKeyValue[];
}

export function extractKeyValues(
  data: IKeyValueEmptyResponse | IKeyValueResponse,
): IGraphKeyValues {
  try {
    if (data instanceof Array) {
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

export const { useLazyGetAnalyticJobsQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAnalyticJobs: builder.query<IGraphKeyValues, string>({
        query: (params) => `/analytics/jobs${params}`,
        transformResponse: (response: IKeyValueResponse) =>
          extractKeyValues(response),
        providesTags: ["Analytics"],
      }),
    }),
  });
