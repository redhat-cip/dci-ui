import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { ITestCaseActionType, ITestSuite } from "types";
import { Table, Thead, Tr, Th, Tbody } from "@patternfly/react-table";
import TestCase from "./TestCase";

interface TestsCasesProps {
  testsuites: ITestSuite[];
}

const testscaseActions: ITestCaseActionType[] = [
  "error",
  "failure",
  "skipped",
  "success",
];

export default function TestSuites({ testsuites }: TestsCasesProps) {
  return (
    <div>
      {testsuites.map((testsuite, i) => (
        <Card key={i} className="pf-v5-u-mb-md">
          <CardTitle>{testsuite.name || `test suite ${i + 1}`}</CardTitle>
          <CardBody>
            {testsuite.properties.length > 0 && (
              <DescriptionList isHorizontal isFluid>
                {testsuite.properties.map((property, i) => (
                  <DescriptionListGroup key={i}>
                    <DescriptionListTerm>{property.name}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {property.value}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ))}
              </DescriptionList>
            )}
            <Table role="grid" aria-label="Testsuite table" variant="compact">
              <Thead>
                <Tr role="row">
                  <Th screenReaderText="Row expansion" />
                  <Th screenReaderText="Testcase action" />
                  <Th width={70}>Name</Th>
                  <Th width={20}>Duration</Th>
                </Tr>
              </Thead>
              <Tbody isExpanded>
                {testsuite.testcases.length === 0 ? (
                  <div>There is no test case in this test suite</div>
                ) : (
                  testsuite.testcases
                    .sort(
                      (tc1, tc2) =>
                        testscaseActions.indexOf(tc1.action) -
                        testscaseActions.indexOf(tc2.action),
                    )
                    .map((testcase, i) => (
                      <TestCase key={i} index={i} testcase={testcase} />
                    ))
                )}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
