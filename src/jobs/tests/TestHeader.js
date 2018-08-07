import React, { Component } from "react";
import { Labels } from "../../ui";

export default class TestHeader extends Component {
  render() {
    const { test, toggleDetails } = this.props;
    return (
      <h2 className="page-header">
        <span className="mr-3">{test.name || "Test"}</span>
        <small className="mr-3">(Duration: {test.time} msec)</small>
        <small>
          <span className="label label-primary mr-1">{test.total} tests</span>
          {test.success ? (
            <span className="label label-success mr-1">
              {test.success} success
            </span>
          ) : null}
          {test.skips ? (
            <span className="label label-warning mr-1">
              {test.skips} skipped
            </span>
          ) : null}
          {test.errors ? (
            <span className="label label-default mr-1">
              {test.errors} errors
            </span>
          ) : null}
          {test.failures ? (
            <span className="label label-danger mr-1">
              {test.failures} failures
            </span>
          ) : null}
          {test.regressions ? (
            <Labels.Regression>
              {test.regressions} regressions
            </Labels.Regression>
          ) : null}
        </small>
        <button
          type="button"
          className="btn btn-default pull-right"
          onClick={() => toggleDetails()}
        >
          See Details
        </button>
      </h2>
    );
  }
}
