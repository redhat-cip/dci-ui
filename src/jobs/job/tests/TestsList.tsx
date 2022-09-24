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

interface TestsListProps {
  tests: ITest[];
}

export default function TestsList({ tests }: TestsListProps) {
  if (isEmpty(tests))
    return (
      <EmptyState title="No tests" info="There is no tests for this job" />
    );
  return (
    <table
      className="pf-c-table pf-m-grid-md"
      role="grid"
      aria-label="List of tests"
      id="tests-list"
    >
      <thead>
        <tr role="row">
          <th role="columnheader" scope="col">
            Test name
          </th>
          <th role="columnheader" scope="col">
            Duration
          </th>
        </tr>
      </thead>
      <tbody>
        {tests.map((test, i) => (
          <tr role="row">
            <td role="cell" data-label="Test name">
              <Link to={test.file_id}>{test.name || "Test"}</Link>
            </td>
            <td
              role="cell"
              data-label="Test humanized duration"
              title={`${test.time}`}
            >
              {humanizeDuration(test.time)}
            </td>
            <td role="cell" data-label="Number of tests">
              <Label color="blue" className="mr-xs">
                {test.total} tests
              </Label>
            </td>
            <td role="cell" data-label="Success">
              {test.success ? (
                <Label
                  icon={<CheckCircleIcon />}
                  color="green"
                  className="mr-xs"
                >
                  {test.success} success
                </Label>
              ) : null}
            </td>
            <td role="cell" data-label="Skipped">
              {test.skips ? (
                <Label
                  icon={<ExclamationTriangleIcon />}
                  color="orange"
                  className="mr-xs"
                >
                  {test.skips} skipped
                </Label>
              ) : null}
            </td>
            <td role="cell" data-label="Error">
              {test.errors ? (
                <Label
                  icon={<ExclamationCircleIcon />}
                  color="red"
                  className="mr-xs"
                >
                  {test.errors} errors
                </Label>
              ) : null}
            </td>
            <td role="cell" data-label="Failed">
              {test.failures ? (
                <Label
                  icon={<ExclamationCircleIcon />}
                  color="red"
                  className="mr-xs"
                >
                  {test.failures} failures
                </Label>
              ) : null}
            </td>
            <td role="cell" data-label="Success fixes">
              {test.successfixes ? (
                <Label
                  icon={<CheckCircleIcon />}
                  color="green"
                  className="mr-xs"
                >
                  {test.successfixes} fixes
                </Label>
              ) : null}
            </td>
            <td role="cell" data-label="Regression">
              {test.regressions ? (
                <Label icon={<ExclamationCircleIcon />} color="red">
                  {test.regressions} regressions
                </Label>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
