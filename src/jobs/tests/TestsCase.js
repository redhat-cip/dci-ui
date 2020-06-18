import React, { Component } from "react";
import { Button, Label } from "@patternfly/react-core";
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
              <Label color="orange">Skip</Label>
            )}
            {testscase.action === "failure" && (
              <Label color="red">Failure</Label>
            )}
            {testscase.action === "error" && <Label color="red">Error</Label>}
            {testscase.action === "passed" && <Label color="green">Pass</Label>}
          </td>
          <td>
            {testscase.regression && <Label color="red">Regression</Label>}
            {testscase.successfix && <Label color="green">Success fix</Label>}
          </td>
          <td>{testscase.classname || testscase.name}</td>
          <td>{testscase.name}</td>
          <td className="text-right col-xs-1">
            {testscase.time}
            &nbsp;s
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
