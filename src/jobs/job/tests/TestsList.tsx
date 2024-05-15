import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import { ITest } from "types";
import { humanizeDuration } from "services/date";
import { Label } from "@patternfly/react-core";
import {
  BugIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@patternfly/react-icons";
import { Link } from "react-router-dom";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

interface TestsListProps {
  tests: ITest[];
}

export default function TestsList({ tests }: TestsListProps) {
  if (isEmpty(tests))
    return (
      <EmptyState title="No tests" info="There is no tests for this job" />
    );
  const reversedTests = [...tests].reverse();
  return (
    <Table
      role="grid"
      aria-label="List of tests"
      id="tests-list"
      variant="compact"
    >
      <Thead>
        <Tr role="row">
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
        {reversedTests.map((test, i) => (
          <Tr role="row">
            <Td role="cell" data-label="Test name">
              <Link to={test.file_id}>{test.name || "Test"}</Link>
            </Td>
            <Td
              role="cell"
              data-label="Test humanized duration"
              title={`${test.time}`}
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
                <Label isCompact icon={<ExclamationCircleIcon />} color="red">
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
                <Label isCompact icon={<ExclamationCircleIcon />} color="red">
                  {test.regressions} with a regression
                </Label>
              ) : null}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
