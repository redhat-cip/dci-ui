import React, { Component } from "react";
import { isEmpty } from "lodash";
import { EmptyState } from "../../ui";
import TestsCase from "./TestsCase";
import { ListFilter } from "../Filters";

export default class TestsCases extends Component {
  constructor(props) {
    super(props);
    const filters = [
      {
        title: "All",
        key: "status",
        value: null
      },
      {
        title: "Passed",
        key: "status",
        value: "passed"
      },
      {
        title: "Skipped",
        key: "status",
        value: "skipped"
      },
      {
        title: "Failure",
        key: "status",
        value: "failure"
      },
      {
        title: "Error",
        key: "status",
        value: "error"
      }
    ];
    this.state = {
      filter: filters[0],
      filters
    };
  }
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
    const filteredTestCases = testscases.filter(testcase => {
      if (!filter.value) return true;
      return testcase.action === filter.value;
    });
    return (
      <div>
        <ListFilter
          placeholder="Filter by Status"
          filter={filter}
          filters={filters}
          onFilterValueSelected={newFilter =>
            this.setState({ filter: newFilter })
          }
        />
        {isEmpty(filteredTestCases) ? (
          <EmptyState
            title="No testcases"
            info="There is no testcases matching this filter"
          />
        ) : (
          <table className="table table-condensed table-bordered">
            <thead>
              <tr>
                <th />
                <th>Status</th>
                <th>Classname</th>
                <th>Name</th>
                <th className="pf-u-text-align-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestCases.map((testscase, i) => (
                <TestsCase key={i} testscase={testscase} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
