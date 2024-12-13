import { Card, CardBody, Label } from "@patternfly/react-core";
import { useJob } from "../jobContext";
import { EmptyState } from "ui";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { Link } from "react-router";
import {
  BugIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@patternfly/react-icons";
import humanizeDuration from "humanize-duration";
import { sumTests } from "jobs/components/TestsLabels";

export default function JobTestsPage() {
  const { job } = useJob();
  const tests = job.tests;
  if (tests.length === 0)
    return (
      <Card>
        <CardBody>
          <EmptyState title="No tests" info="There is no tests for this job" />
        </CardBody>
      </Card>
    );
  const reversedTests = [...tests].reverse();
  const total = sumTests(reversedTests);
  return (
    <Card>
      <CardBody>
        <Table id="tests-list" aria-label="List of tests">
          <Thead>
            <Tr>
              <Th role="columnheader" scope="col">
                Test name
              </Th>
              <Th role="columnheader" scope="col">
                Duration
              </Th>
              <Th textCenter role="columnheader" scope="col" width={10}>
                Nb of tests
              </Th>
              <Th textCenter role="columnheader" scope="col" width={10}>
                Successful tests
              </Th>
              <Th textCenter role="columnheader" scope="col" width={10}>
                Tests in error
              </Th>
              <Th textCenter role="columnheader" scope="col" width={10}>
                Failed tests
              </Th>
              <Th textCenter role="columnheader" scope="col" width={10}>
                Skipped tests
              </Th>
              <Th textCenter role="columnheader" scope="col" width={10}>
                Tests fixed
              </Th>
              <Th textCenter role="columnheader" scope="col" width={10}>
                Regressions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td role="cell" colSpan={2}>
                Total
              </Td>
              <Td textCenter role="cell" data-label="Number of tests">
                <Label isCompact color="blue">
                  {total.total} {`test${total.total > 1 ? "s" : ""}`}
                </Label>
              </Td>
              <Td textCenter role="cell" data-label="Success">
                {total.success ? (
                  <Label isCompact icon={<CheckCircleIcon />} color="green">
                    {total.success} passed
                  </Label>
                ) : null}
              </Td>
              <Td textCenter role="cell" data-label="Error">
                {total.errors ? (
                  <Label isCompact icon={<ExclamationCircleIcon />} color="red">
                    {total.errors} in error
                  </Label>
                ) : null}
              </Td>
              <Td textCenter role="cell" data-label="Failed">
                {total.failures ? (
                  <Label isCompact icon={<BugIcon />} color="red">
                    {total.failures} failed
                  </Label>
                ) : null}
              </Td>
              <Td textCenter role="cell" data-label="Skipped">
                {total.skips ? (
                  <Label
                    isCompact
                    icon={<ExclamationTriangleIcon />}
                    color="orange"
                  >
                    {total.skips} skipped
                  </Label>
                ) : null}
              </Td>
              <Td textCenter role="cell" data-label="Success fixes">
                {total.successfixes ? (
                  <Label isCompact icon={<CheckCircleIcon />} color="green">
                    {total.successfixes} fixed
                  </Label>
                ) : null}
              </Td>
              <Td textCenter role="cell" data-label="Regression">
                {total.regressions ? (
                  <Label isCompact icon={<ExclamationCircleIcon />} color="red">
                    {total.regressions} with a regression
                  </Label>
                ) : null}
              </Td>
            </Tr>
            {reversedTests.map((test, i) => (
              <Tr key={i}>
                <Td
                  role="cell"
                  data-label="Test name"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <Link to={test.file_id}>{test.name || "Test"}</Link>
                </Td>
                <Td
                  role="cell"
                  data-label="Test humanized duration"
                  title={`${test.time}`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {humanizeDuration(test.time)}
                </Td>
                <Td textCenter role="cell" data-label="Number of tests">
                  <Label isCompact color="blue">
                    {test.total} {`test${test.total > 1 ? "s" : ""}`}
                  </Label>
                </Td>
                <Td textCenter role="cell" data-label="Success">
                  {test.success ? (
                    <Label isCompact icon={<CheckCircleIcon />} color="green">
                      {test.success} passed
                    </Label>
                  ) : null}
                </Td>
                <Td textCenter role="cell" data-label="Error">
                  {test.errors ? (
                    <Label
                      isCompact
                      icon={<ExclamationCircleIcon />}
                      color="red"
                    >
                      {test.errors} in error
                    </Label>
                  ) : null}
                </Td>
                <Td textCenter role="cell" data-label="Failed">
                  {test.failures ? (
                    <Label isCompact icon={<BugIcon />} color="red">
                      {test.failures} failed
                    </Label>
                  ) : null}
                </Td>
                <Td textCenter role="cell" data-label="Skipped">
                  {test.skips ? (
                    <Label
                      isCompact
                      icon={<ExclamationTriangleIcon />}
                      color="orange"
                    >
                      {test.skips} skipped
                    </Label>
                  ) : null}
                </Td>
                <Td textCenter role="cell" data-label="Success fixes">
                  {test.successfixes ? (
                    <Label isCompact icon={<CheckCircleIcon />} color="green">
                      {test.successfixes} fixed
                    </Label>
                  ) : null}
                </Td>
                <Td textCenter role="cell" data-label="Regression">
                  {test.regressions ? (
                    <Label
                      isCompact
                      icon={<ExclamationCircleIcon />}
                      color="red"
                    >
                      {test.regressions} with a regression
                    </Label>
                  ) : null}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
