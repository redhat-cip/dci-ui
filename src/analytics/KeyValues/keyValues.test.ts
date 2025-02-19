import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";
import { extractKeysValues, getTicksInRange } from "./keyValues";

test("extractKeysValues with empty data", () => {
  const emptyData: IGetAnalyticsJobsEmptyResponse = {};
  expect(extractKeysValues(emptyData)).toEqual({
    keys: [],
    data: [],
    groupByKeys: {
      name: [],
      status: [],
      team: [],
      topic: [],
      pipeline: [],
    },
  });
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
          _id: "j1",
          _index: "jobs",
          _score: null,
          _source: {
            created_at: "2024-10-17T14:38:41.696112",
            id: "j1",
            name: "job.1",
            keys_values: [
              {
                job_id: "j1",
                key: "workarounds",
                value: 1.0,
              },
              {
                job_id: "j1",
                key: "reboots",
                value: 0,
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
            topic: {
              name: "Topic 1",
            },
            tags: [],
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
    keys: ["workarounds", "reboots"],
    data: [
      {
        id: "j1",
        name: "job.1",
        created_at: 1729175921696,
        keysValues: {
          workarounds: 1.0,
          job_1_workarounds: 1.0,
          success_workarounds: 1.0,
          team_1_workarounds: 1.0,
          topic_1_workarounds: 1.0,
          reboots: 0,
          job_1_reboots: 0,
          success_reboots: 0,
          team_1_reboots: 0,
          topic_1_reboots: 0,
        },
      },
    ],
    groupByKeys: {
      name: ["job_1_workarounds", "job_1_reboots"],
      status: ["success_workarounds", "success_reboots"],
      team: ["team_1_workarounds", "team_1_reboots"],
      topic: ["topic_1_workarounds", "topic_1_reboots"],
      pipeline: [],
    },
  });
});

test("getTicksInRange", () => {
  const range = { after: "2024-10-14", before: "2024-10-18" };
  expect(getTicksInRange(range)).toEqual([
    1728864000000, 1728950400000, 1729036800000, 1729123200000, 1729209600000,
  ]);
});
