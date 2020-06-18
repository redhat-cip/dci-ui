import React, { Component } from "react";
import { Button, Label } from "@patternfly/react-core";
import { humanizeDuration } from "services/date";

export default class TestHeader extends Component {
  render() {
    const { test, toggleDetails } = this.props;
    return (
      <div className="pf-c-data-list__item">
        <div className="pf-c-data-list__cell">
          {test.name || "Test"} ({humanizeDuration(test.time)})
        </div>
        <div className="pf-c-data-list__cell">
          <small>
            <Label color="blue" className="mr-xs">
              {test.total} tests
            </Label>
            {test.successfixes ? (
              <Label color="green" className="mr-xs">
                {test.successfixes} fixes
              </Label>
            ) : null}
            {test.success ? (
              <Label color="green" className="mr-xs">
                {test.success} success
              </Label>
            ) : null}
            {test.skips ? (
              <Label color="orange" className="mr-xs">
                {test.skips} skipped
              </Label>
            ) : null}
            {test.errors ? (
              <Label color="red" className="mr-xs">
                {test.errors} errors
              </Label>
            ) : null}
            {test.failures ? (
              <Label color="red" className="mr-xs">
                {test.failures} failures
              </Label>
            ) : null}
            {test.regressions ? (
              <Label color="red">
                {`${test.regressions} regression${
                  test.regressions > 1 ? "s" : ""
                }`}
              </Label>
            ) : null}
          </small>
        </div>
        <div className="pf-c-data-list__cell text-right">
          <Button
            type="button"
            variant="tertiary"
            onClick={() => toggleDetails()}
          >
            See tests details
          </Button>
        </div>
      </div>
    );
  }
}
