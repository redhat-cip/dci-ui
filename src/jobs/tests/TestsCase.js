import React, { Component } from "react";
import { Labels } from "ui";
import { Button } from "@patternfly/react-core";
import { CaretDownIcon, CaretRightIcon } from "@patternfly/react-icons";
import { Pre } from "jobs/jobStates/JobStateComponents";

export default class Testcases extends Component {
  state = {
    seeDetails: false,
  };

  toggleDetails = () => {
    this.setState((prevState) => {
      return {
        seeDetails: !prevState.seeDetails,
      };
    });
  };

  render() {
    const { testscase } = this.props;
    const { seeDetails } = this.state;
    return (
      <React.Fragment>
        <tr>
          <td className="text-center">
            <Button variant="link" onClick={this.toggleDetails}>
              {seeDetails ? <CaretDownIcon /> : <CaretRightIcon />}
            </Button>
          </td>
          <td>
            {testscase.action === "skipped" && (
              <Labels.Warning>Skip</Labels.Warning>
            )}
            {testscase.action === "failure" && (
              <Labels.Failure>Failure</Labels.Failure>
            )}
            {testscase.action === "error" && <Labels.Error>Error</Labels.Error>}
            {testscase.action === "passed" && (
              <Labels.Success>Pass</Labels.Success>
            )}
          </td>
          <td>
            {testscase.regression && (
              <Labels.Failure>Regression</Labels.Failure>
            )}
            {testscase.successfix && (
              <Labels.Success>Success fix</Labels.Success>
            )}
          </td>
          <td>{testscase.classname || testscase.name}</td>
          <td>{testscase.name}</td>
          <td className="text-right col-xs-1">
            {testscase.time}
            &nbsp;ms
          </td>
        </tr>
        {seeDetails ? (
          <tr style={{ borderTop: 0 }}>
            <td colspan={6}>
              <b>Type:</b> {testscase.type}
              <br />
              <b>Message:</b> {testscase.message}
              <br />
              <b>Value:</b>
              <Pre>{testscase.value}</Pre>
            </td>
          </tr>
        ) : null}
      </React.Fragment>
    );
  }
}
