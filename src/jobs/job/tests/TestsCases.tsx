import { ITestsCase, TestCaseActionType } from "types";
import { sortBy } from "lodash";
import TestsCase from "./TestsCase";

interface TestsCasesProps {
  testscases: ITestsCase[];
}

export default function TestsCases({ testscases }: TestsCasesProps) {
  const testscaseActions: TestCaseActionType[] = [
    "error",
    "failure",
    "skipped",
    "passed",
  ];
  const orderedTestsCases = sortBy(testscases, (tc) =>
    testscaseActions.indexOf(tc.action)
  );
  return (
    <table className="pf-c-table pf-m-expandable pf-m-compact">
      <thead>
        <tr>
          <th />
          <th>Status</th>
          <th>Regression</th>
          <th>Success Fix</th>
          <th>Classname</th>
          <th>Name</th>
          <th className="text-right">Time</th>
        </tr>
      </thead>
      {orderedTestsCases.map((tc, i) => (
        <TestsCase key={i} testscase={tc} />
      ))}
    </table>
  );
}
