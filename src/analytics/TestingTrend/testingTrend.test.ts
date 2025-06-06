import { IAnalyticsTestsJob } from "types";
import { getTestingTrend } from "./testingTrend";
import { analyticsTwoJobs } from "analytics/analyticsTestData";

describe("getTestingTrend", () => {
  test("getTestingTrend no data", () => {
    expect(getTestingTrend([])).toEqual([]);
  });

  test("get testing trend with 2 jobs", () => {
    const jobs: IAnalyticsTestsJob[] = [
      {
        ...analyticsTwoJobs[0],
        tests: [
          {
            name: "test without testsuites",
          },
          {
            name: "test 2",
            testsuites: [
              {
                testcases: [
                  {
                    action: "success",
                    classname: "class1",
                    name: "testcase 1",
                  },
                  {
                    action: "failure",
                    classname: "class1",
                    name: "testcase 2",
                  },
                ],
              },
            ],
          },
          {
            name: "test 3",
            testsuites: [
              {
                testcases: [
                  {
                    action: "success",
                    classname: "class2",
                    name: "testcase 1",
                  },
                  {
                    action: "success",
                    classname: "class2",
                    name: "testcase 2",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        ...analyticsTwoJobs[1],
        tests: [
          {
            name: "test 2",
            testsuites: [
              {
                testcases: [
                  {
                    action: "failure",
                    classname: "class1",
                    name: "testcase 1",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const trend = getTestingTrend(jobs);
    expect(trend).toEqual([
      {
        name: "class1::testcase 1",
        jobs: [
          {
            id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-12-04T16:32:24.840989",
            status: "success",
          },
          {
            id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-10-17T14:38:41.696112",
            status: "failure",
          },
        ],
      },
      {
        name: "class1::testcase 2",
        jobs: [
          {
            id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-12-04T16:32:24.840989",
            status: "failure",
          },
          {
            id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-10-17T14:38:41.696112",
            status: "absent",
          },
        ],
      },
      {
        name: "class2::testcase 1",
        jobs: [
          {
            id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-12-04T16:32:24.840989",
            status: "success",
          },
          {
            id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-10-17T14:38:41.696112",
            status: "absent",
          },
        ],
      },
      {
        name: "class2::testcase 2",
        jobs: [
          {
            id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-12-04T16:32:24.840989",
            status: "success",
          },
          {
            id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-10-17T14:38:41.696112",
            status: "absent",
          },
        ],
      },
    ]);
  });

  test("nrt get testing keep same number of jobs", () => {
    const jobs: IAnalyticsTestsJob[] = [
      {
        ...analyticsTwoJobs[0],
        tests: [],
      },
      {
        ...analyticsTwoJobs[1],
        tests: [
          {
            name: "test 2",
            testsuites: [
              {
                testcases: [
                  {
                    action: "failure",
                    classname: "class1",
                    name: "testcase 1",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const trend = getTestingTrend(jobs);
    expect(trend).toEqual([
      {
        name: "class1::testcase 1",
        jobs: [
          {
            id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-12-04T16:32:24.840989",
            status: "absent",
          },
          {
            id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
            created_at: "2024-10-17T14:38:41.696112",
            status: "failure",
          },
        ],
      },
    ]);
  });
});
