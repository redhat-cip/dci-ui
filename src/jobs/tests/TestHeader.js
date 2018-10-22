import React, { Component } from "react";
import { Labels } from "../../ui";
import { Button } from "@patternfly/react-core";

export default class TestHeader extends Component {
  render() {
    const { test, toggleDetails } = this.props;
    return (
      <h2 className="page-header">
        <span className="pf-u-mr-xl">{test.name || "Test"}</span>
        <small className="pf-u-mr-xl">(Duration: {test.time} msec)</small>
        <small>
          <span className="label label-primary pf-u-mr-xl">{test.total} tests</span>
          {test.success ? (
            <span className="label label-success pf-u-mr-xl">
              {test.success} success
            </span>
          ) : null}
          {test.skips ? (
            <span className="label label-warning pf-u-mr-xl">
              {test.skips} skipped
            </span>
          ) : null}
          {test.errors ? (
            <span className="label label-default pf-u-mr-xl">
              {test.errors} errors
            </span>
          ) : null}
          {test.failures ? (
            <span className="label label-danger pf-u-mr-xl">
              {test.failures} failures
            </span>
          ) : null}
          {test.regressions ? (
            <Labels.Regression>
              {test.regressions} regressions
            </Labels.Regression>
          ) : null}
        </small>
        <Button
          type="button"
          variant="tertiary"
          onClick={() => toggleDetails()}
        >
          See Details
        </Button>
      </h2>
    );
  }
}
