import { ITestCase, ITestCaseActionType } from "types";
import { sortBy } from "lodash";
import TestCase from "./TestCase";

interface ITestCasesProps {
  testcases: ITestCase[];
}

export default function TestCases({ testcases }: ITestCasesProps) {
  const testscaseActions: ITestCaseActionType[] = [
    "error",
    "failure",
    "skipped",
    "success",
  ];
  const orderedTestsCases = sortBy(testcases, (tc) =>
    testscaseActions.indexOf(tc.action),
  );
  return (
    <div style={{ overflowX: "auto" }}>
      {orderedTestsCases.map((tc, i) => (
        <TestCase key={i} testcase={tc} />
      ))}
    </div>
  );
}
