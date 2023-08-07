import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import { ITest } from "types";
import { humanizeDuration } from "services/date";
import { Label } from "@patternfly/react-core";
import {
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
  return (
    <Table
      className="pf-v5-c-table pf-m-grid-md"
      role="grid"
      aria-label="List of tests"
      id="tests-list"
    >
      <Thead>
        <Tr role="row">
          <Th role="columnheader" scope="col">
            Test name
          </Th>
          <Th role="columnheader" scope="col">
            Duration
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {tests.map((test, i) => (
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
            <Td role="cell" data-label="Number of tests">
              <Label color="blue" className="pf-v5-u-mr-xs">
                {test.total} tests
              </Label>
            </Td>
            <Td role="cell" data-label="Success">
              {test.success ? (
                <Label
                  icon={<CheckCircleIcon />}
                  color="green"
                  className="pf-v5-u-mr-xs"
                >
                  {test.success} success
                </Label>
              ) : null}
            </Td>
            <Td role="cell" data-label="Skipped">
              {test.skips ? (
                <Label
                  icon={<ExclamationTriangleIcon />}
                  color="orange"
                  className="pf-v5-u-mr-xs"
                >
                  {test.skips} skipped
                </Label>
              ) : null}
            </Td>
            <Td role="cell" data-label="Error">
              {test.errors ? (
                <Label
                  icon={<ExclamationCircleIcon />}
                  color="red"
                  className="pf-v5-u-mr-xs"
                >
                  {test.errors} errors
                </Label>
              ) : null}
            </Td>
            <Td role="cell" data-label="Failed">
              {test.failures ? (
                <Label
                  icon={<ExclamationCircleIcon />}
                  color="red"
                  className="pf-v5-u-mr-xs"
                >
                  {test.failures} failures
                </Label>
              ) : null}
            </Td>
            <Td role="cell" data-label="Success fixes">
              {test.successfixes ? (
                <Label
                  icon={<CheckCircleIcon />}
                  color="green"
                  className="pf-v5-u-mr-xs"
                >
                  {test.successfixes} fixes
                </Label>
              ) : null}
            </Td>
            <Td role="cell" data-label="Regression">
              {test.regressions ? (
                <Label icon={<ExclamationCircleIcon />} color="red">
                  {test.regressions} regressions
                </Label>
              ) : null}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
