import React, { Component } from "react";
import { isEmpty } from "lodash";
import { EmptyState } from "../../ui";
import TestsCase from "./TestsCase";
import { StatusFilter } from "../Filters";

export default class TestsCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null
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
    const { status } = this.state;
    const filteredTestCases = testscases.filter(testcase => {
      if (!status) return true;
      return testcase.action === status;
    });
    return (
      <div>
        <StatusFilter
          filters={filters}
          addFilter={filter => this.setState({ status: filter.value })}
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
                <th className="text-right">Time</th>
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
