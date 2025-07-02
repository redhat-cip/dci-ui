import type { IAnalyticsTestsJob, ITestCaseActionType } from "types";

export type TestCaseResult = ITestCaseActionType | "absent";

export type TestcaseEntry = {
  classname: string;
  filename: string;
  name: string;
  id: string;
  jobs: {
    id: string;
    created_at: string;
    fileId: string | null;
    status: TestCaseResult;
  }[];
};

export function analyseTests(jobs: IAnalyticsTestsJob[]): TestcaseEntry[] {
  const jobMeta = jobs.map(({ id, created_at }) => ({ id, created_at }));
  const jobKeyFileIds: Record<string, { [key: string]: string }> = {};
  const testcaseMap: Record<
    string,
    {
      filename: string;
      classname: string;
      name: string;
      jobStatuses: Record<string, TestCaseResult>;
    }
  > = {};

  for (const job of jobs) {
    const jobId = job.id;
    for (const test of job.tests ?? []) {
      const fileId = test.file_id;
      const filename = test.name;
      for (const suite of test.testsuites ?? []) {
        for (const testcase of suite.testcases ?? []) {
          const classname = testcase.classname;
          const name = testcase.name;
          const key = `${filename}|${classname}|${name}`;
          if (!testcaseMap[key]) {
            testcaseMap[key] = {
              filename,
              classname,
              name,
              jobStatuses: {},
            };
          }
          if (!jobKeyFileIds[jobId]) {
            jobKeyFileIds[jobId] = {};
          }
          jobKeyFileIds[jobId][key] = fileId;
          testcaseMap[key].jobStatuses[jobId] = testcase.action;
        }
      }
    }
  }

  return Object.entries(testcaseMap).map(([key, entry]) => ({
    id: key,
    filename: entry.filename,
    classname: entry.classname,
    name: entry.name,
    jobs: jobMeta.map(({ id, created_at }) => ({
      id,
      created_at,
      fileId: jobKeyFileIds[id]?.[key] ?? null,
      status: entry.jobStatuses[id] ?? "absent",
    })),
  }));
}
