import React, { Component } from "react";
import {isEmpty} from "lodash-es";
import { EmptyState } from "../../ui";
import TestsCase from "./TestsCase";

export default class TestsCases extends Component {
  render() {
    const { testscases } = this.props;
    if (isEmpty(testscases))
      return (
        <EmptyState
          title="No tests"
          info="There is no tests for this test"
        />
      );
    return (
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
          {testscases.map((testscase, i) => (
            <TestsCase key={i} testscase={testscase} />
          ))}
        </tbody>
      </table>
    );
  }
}
