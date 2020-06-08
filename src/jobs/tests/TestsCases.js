import React, { Component } from "react";
import { isEmpty } from "lodash";
import { EmptyState, Filter } from "ui";
import TestsCase from "./TestsCase";
import { SearchIcon } from "@patternfly/react-icons";

export default class TestsCases extends Component {
  state = {
    filter: {
      name: "All",
      key: "status",
      value: null,
    },
    filters: [
      {
        name: "All",
        key: "status",
        value: null,
      },
      {
        name: "Passed",
        key: "status",
        value: "passed",
      },
      {
        name: "Skipped",
        key: "status",
        value: "skipped",
      },
      {
        name: "Failure",
        key: "status",
        value: "failure",
      },
      {
        name: "Error",
        key: "status",
        value: "error",
      },
    ],
  };
  render() {
    const { testscases } = this.props;
    if (isEmpty(testscases))
      return (
        <EmptyState
          title="No testcases"
          info="There is no testcases for this test"
        />
      );

    const { filter, filters } = this.state;
    const filteredTestCases = testscases.filter((testcase) => {
      if (!filter.value) return true;
      return testcase.action === filter.value;
    });
    return (
      <table className="pf-c-table pf-m-grid-md">
        <thead>
          <tr>
            <th />
            <th>
              <Filter
                placeholder="Filter by Status"
                filter={filter}
                filters={filters}
                onFilterValueSelected={(newFilter) =>
                  this.setState({ filter: newFilter })
                }
              />
            </th>
            <th>
              Regression
              <br />
              Success Fix
            </th>
            <th>Classname</th>
            <th>Name</th>
            <th className="text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty(filteredTestCases) ? (
            <tr>
              <td colspan={6}>
                <EmptyState
                  icon={<SearchIcon size="lg" />}
                  title="No testcases"
                  info="There is no testcases matching this filter"
                />
              </td>
            </tr>
          ) : (
            filteredTestCases.map((testscase, i) => (
              <TestsCase key={i} testscase={testscase} />
            ))
          )}
        </tbody>
      </table>
    );
  }
}
