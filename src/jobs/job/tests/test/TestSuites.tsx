import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import { ITestSuite } from "types";
import TestCases from "./TestCases";

interface TestsCasesProps {
  testsuites: ITestSuite[];
}

export default function TestSuites({ testsuites }: TestsCasesProps) {
  return (
    <div>
      {testsuites.map((testsuite, i) => (
        <Card>
          <CardTitle>{testsuite.name || `test suite ${i + 1}`}</CardTitle>
          <CardBody>
            {testsuite.testcases.length === 0 ? (
              <div>There is no test case in this test suite</div>
            ) : (
              <TestCases key={i} testcases={testsuite.testcases} />
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
