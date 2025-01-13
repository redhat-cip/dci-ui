import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";
import { extractKeysValues } from "./keyValues";

test("extractKeysValues with empty data", () => {
  const emptyData: IGetAnalyticsJobsEmptyResponse = {};
  expect(extractKeysValues(emptyData)).toEqual({ keys: [], data: [] });
});

test("extractKeysValues with result", () => {
  const result: IGetAnalyticsJobsResponse = {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      hits: [
        {
          _id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
          _index: "jobs",
          _score: null,
          _source: {
            created_at: "2024-10-17T14:38:41.696112",
            id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
            name: "job1",
            keys_values: [
              {
                job_id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
                key: "workarounds",
                value: 1.0,
              },
            ],
            comment: "",
            components: [],
            duration: 905,
            results: {
              errors: 0,
              failures: 1,
              success: 2,
              skips: 3,
              total: 6,
            },
            pipeline: null,
            status: "success",
            status_reason: "",
            team: {
              id: "t1",
              name: "Team 1",
            },
          },
          _type: "_doc",
          sort: ["2024-10-17T14:38:41.696Z"],
        },
      ],
      max_score: null,
      total: {
        relation: "eq",
        value: 684,
      },
    },
    timed_out: false,
    took: 668,
  };
  expect(extractKeysValues(result)).toEqual({
    keys: ["workarounds"],
    data: [
      {
        id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
        name: "job1",
        created_at: 1729175921696,
        keysValues: {
          workarounds: 1.0,
        },
      },
    ],
  });
});
