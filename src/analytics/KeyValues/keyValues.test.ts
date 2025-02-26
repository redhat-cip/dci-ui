import { IGetAnalyticsJobsEmptyResponse } from "types";
import { extractKeysValues, getTicksInRange } from "./keyValues";
import { analyticsOneJob } from "analytics/analyticsTestData";

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
  expect(extractKeysValues(analyticsOneJob)).toEqual({
    keys: ["workarounds", "reboots"],
    data: [
      {
        id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
        name: "job1",
        created_at: 1729175921696,
        keysValues: {
          workarounds: 1.0,
          job1_workarounds: 1.0,
          pipeline_reboots: 0,
          pipeline_workarounds: 1,
          success_workarounds: 1.0,
          team_1_workarounds: 1.0,
          topic_1_workarounds: 1.0,
          reboots: 0,
          job1_reboots: 0,
          success_reboots: 0,
          team_1_reboots: 0,
          topic_1_reboots: 0,
        },
      },
    ],
    groupByKeys: {
      name: ["job1_workarounds", "job1_reboots"],
      status: ["success_workarounds", "success_reboots"],
      team: ["team_1_workarounds", "team_1_reboots"],
      topic: ["topic_1_workarounds", "topic_1_reboots"],
      pipeline: ["pipeline_workarounds", "pipeline_reboots"],
    },
  });
});

test("getTicksInRange", () => {
  const range = { after: "2024-10-14", before: "2024-10-18" };
  expect(getTicksInRange(range)).toEqual([
    1728864000000, 1728950400000, 1729036800000, 1729123200000, 1729209600000,
  ]);
});
