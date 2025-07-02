import type { IAnalyticsTestsJob } from "types";
import { analyseTests } from "./testsAnalysis";
import { analyticsTwoJobs } from "analytics/analyticsTestData";

describe("getTestingTrend", () => {
  test("getTestingTrend no data", () => {
    expect(analyseTests([])).toEqual([]);
  });

  test("get testing trend with 2 jobs", () => {
    const jobs: IAnalyticsTestsJob[] = [
      {
        ...analyticsTwoJobs[0],
        tests: [
          {
            file_id: "71e07cda-a17d-48be-9d9f-211732216ef9",
            name: "test without testsuites",
          },
          {
            file_id: "84635f7f-ad47-4793-8769-0eb46c160640",
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
        ],
      },
      {
        ...analyticsTwoJobs[1],
        tests: [
          {
            file_id: "7fbd3bd3-1591-43b4-8753-a5b7e3f8230f",
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

    const trend = analyseTests(jobs);
    expect(trend).toEqual([
      {
        classname: "class1",
        filename: "test 2",
        name: "testcase 1",
        id: "test 2|class1|testcase 1",
        jobs: [
          {
            id: analyticsTwoJobs[0].id,
            created_at: analyticsTwoJobs[0].created_at,
            fileId: "84635f7f-ad47-4793-8769-0eb46c160640",
            status: "success",
          },
          {
            id: analyticsTwoJobs[1].id,
            created_at: analyticsTwoJobs[1].created_at,
            fileId: "7fbd3bd3-1591-43b4-8753-a5b7e3f8230f",
            status: "failure",
          },
        ],
      },
      {
        id: "test 2|class1|testcase 2",
        classname: "class1",
        filename: "test 2",
        name: "testcase 2",
        jobs: [
          {
            id: analyticsTwoJobs[0].id,
            created_at: analyticsTwoJobs[0].created_at,
            fileId: "84635f7f-ad47-4793-8769-0eb46c160640",
            status: "failure",
          },
          {
            id: analyticsTwoJobs[1].id,
            created_at: analyticsTwoJobs[1].created_at,
            fileId: null,
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
            file_id: "e2e8403e-ec24-4860-bae0-5e22e78922bb",
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

    const trend = analyseTests(jobs);
    expect(trend).toEqual([
      {
        id: "test 2|class1|testcase 1",
        classname: "class1",
        filename: "test 2",
        name: "testcase 1",
        jobs: [
          {
            id: analyticsTwoJobs[0].id,
            created_at: analyticsTwoJobs[0].created_at,
            fileId: null,
            status: "absent",
          },
          {
            id: analyticsTwoJobs[1].id,
            created_at: analyticsTwoJobs[1].created_at,
            fileId: "e2e8403e-ec24-4860-bae0-5e22e78922bb",
            status: "failure",
          },
        ],
      },
    ]);
  });

  test("nrt same testcases are per test files", () => {
    const jobs: IAnalyticsTestsJob[] = [
      {
        ...analyticsTwoJobs[0],
        tests: [
          {
            file_id: "fae5597a-aed0-447f-9852-d6513c8c8583",
            name: "test 1",
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
      {
        ...analyticsTwoJobs[1],
        tests: [
          {
            file_id: "2b131003-b149-4d32-bf7d-b3ad5bc1fede",
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

    const trend = analyseTests(jobs);
    expect(trend).toEqual([
      {
        id: "test 1|class1|testcase 1",
        classname: "class1",
        filename: "test 1",
        name: "testcase 1",
        jobs: [
          {
            id: analyticsTwoJobs[0].id,
            created_at: analyticsTwoJobs[0].created_at,
            fileId: "fae5597a-aed0-447f-9852-d6513c8c8583",
            status: "failure",
          },
          {
            id: analyticsTwoJobs[1].id,
            created_at: analyticsTwoJobs[1].created_at,
            fileId: null,
            status: "absent",
          },
        ],
      },
      {
        id: "test 2|class1|testcase 1",
        classname: "class1",
        filename: "test 2",
        name: "testcase 1",
        jobs: [
          {
            id: analyticsTwoJobs[0].id,
            created_at: analyticsTwoJobs[0].created_at,
            fileId: null,
            status: "absent",
          },
          {
            id: analyticsTwoJobs[1].id,
            created_at: analyticsTwoJobs[1].created_at,
            fileId: "2b131003-b149-4d32-bf7d-b3ad5bc1fede",
            status: "failure",
          },
        ],
      },
    ]);
  });
});
