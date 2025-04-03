import { Card, CardTitle, Button, CardBody } from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import type { JunitData } from "./junitComparisonApi";

export function TestListDetails({
  data,
  lowerBoundary,
  upperBoundary,
  resetRange,
}: {
  data: JunitData["bar_chart"];
  lowerBoundary: number | null;
  upperBoundary: number | null;
  resetRange: () => void;
}) {
  return (
    <Card>
      <CardTitle>
        <div>
          {lowerBoundary === null
            ? upperBoundary === null
              ? "All testcases"
              : `Testcases under ${upperBoundary}%`
            : upperBoundary === null
              ? `Testcases over ${lowerBoundary}%`
              : `Testcases between ${lowerBoundary}% and ${upperBoundary}%`}
          {lowerBoundary !== null && upperBoundary !== null && (
            <small>
              <Button variant="link" onClick={resetRange}>
                (reset)
              </Button>
            </small>
          )}
        </div>
      </CardTitle>
      <CardBody>
        <Table aria-label="junit testcase details">
          <Thead>
            <Tr>
              <Th role="columnheader" scope="col">
                Testcase name
              </Th>
              <Th
                role="columnheader"
                scope="col"
                style={{ textAlign: "center" }}
              >
                <span>% of deviation</span>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.details
              .filter((detail) =>
                lowerBoundary ? detail.value > lowerBoundary : true,
              )
              .filter((detail) =>
                upperBoundary ? detail.value < upperBoundary : true,
              )
              .map((detail) => (
                <Tr>
                  <Td>{detail.testcase}</Td>
                  <Td style={{ textAlign: "center" }}>
                    <span title={detail.value.toString()}>
                      {Math.round(detail.value * 100) / 100}%
                    </span>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
