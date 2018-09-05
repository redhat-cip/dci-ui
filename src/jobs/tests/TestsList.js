import React, { Component } from "react";
import { isEmpty } from "lodash";
import { EmptyState } from "../../ui";
import Test from "./Test";

export default class TestsList extends Component {
  render() {
    const { tests } = this.props;
    if (isEmpty(tests))
      return (
        <EmptyState title="No tests" info="There is no tests for this job" />
      );
    return (
      <div className="TestsList">
        {tests.map((test, i) => (
          <Test key={i} test={test} />
        ))}
      </div>
    );
  }
}
