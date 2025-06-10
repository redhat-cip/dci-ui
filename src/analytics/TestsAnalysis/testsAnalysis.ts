import { IAnalyticsTestsJob, ITestCaseActionType } from "types";

type TestCaseResult = ITestCaseActionType | "absent";

export type TestcaseEntry = {
  name: string;
  jobs: { id: string; created_at: string; status: TestCaseResult }[];
};

export function analyseTests(jobs: IAnalyticsTestsJob[]) {
  const jobMeta = jobs.map((job) => ({
    id: job.id,
    created_at: job.created_at,
  }));

  const testcaseMap: Map<string, Map<string, TestCaseResult>> = new Map();

  for (const job of jobs) {
    const jobId = job.id;

    const jobResults = new Map<string, TestCaseResult>();
    for (const test of job.tests ?? []) {
      for (const suite of test.testsuites ?? []) {
        for (const testcase of suite.testcases ?? []) {
          const key = `${testcase.classname}::${testcase.name}`;
          jobResults.set(key, testcase.action);
        }
      }
    }

    for (const [testcaseKey, status] of jobResults.entries()) {
      if (!testcaseMap.has(testcaseKey)) {
        testcaseMap.set(testcaseKey, new Map());
      }
      testcaseMap.get(testcaseKey)!.set(jobId, status);
    }
  }

  const result: {
    name: string;
    jobs: { id: string; created_at: string; status: TestCaseResult }[];
  }[] = [];

  for (const [testcaseKey, jobStatusMap] of testcaseMap.entries()) {
    const jobsData = jobMeta.map(({ id, created_at }) => ({
      id,
      created_at,
      status: jobStatusMap.get(id) ?? "absent",
    }));
    result.push({ name: testcaseKey, jobs: jobsData });
  }

  return result;
}
