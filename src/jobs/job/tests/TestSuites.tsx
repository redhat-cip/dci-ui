import { ITestSuite } from "types";
import TestCases from "./TestCases";

interface TestsCasesProps {
  testsuites: ITestSuite[];
}

export default function TestSuites({ testsuites }: TestsCasesProps) {
  return (
    <div>
      {testsuites.map((testsuite, i) => (
        <div className="mt-lg mb-lg">
          <h3 className="mb-xs ml-md">
            {testsuite.name || `test suite ${i + 1}`}
          </h3>
          {testsuite.testcases.length === 0 ? (
            <div>There is no test case in this test suite</div>
          ) : (
            <TestCases key={i} testcases={testsuite.testcases} />
          )}
        </div>
      ))}
    </div>
  );
}
