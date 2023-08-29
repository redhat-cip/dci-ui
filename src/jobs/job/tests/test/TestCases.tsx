import { ITestCase, ITestCaseActionType } from "types";
import { sortBy } from "lodash";
import TestCase from "./TestCase";
import { DataList } from "@patternfly/react-core";

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
    <DataList aria-label="Expandable testcase list">
      {orderedTestsCases.map((tc, i) => (
        <TestCase key={i} index={i} testcase={tc} />
      ))}
    </DataList>
  );
}
