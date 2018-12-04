import React, { Component } from "react";
import { Labels } from "../../ui";
import { CaretDownIcon, CaretRightIcon } from "@patternfly/react-icons";
import { Pre } from "../jobStates/JobStateComponents";

export default class Testcases extends Component {
  state = {
    seeDetails: false
  };

  toggleDetails = () => {
    this.setState(prevState => {
      return {
        seeDetails: !prevState.seeDetails
      };
    });
  };

  render() {
    const { testscase } = this.props;
    const { seeDetails } = this.state;
    return (
      <React.Fragment>
        <tr>
          <td onClick={this.toggleDetails} className="pf-u-text-align-center">
            {seeDetails ? <CaretDownIcon /> : <CaretRightIcon />}
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
            {testscase.regression && (
              <Labels.Regression>Regression</Labels.Regression>
            )}
          </td>
          <td>{testscase.classname || testscase.name}</td>
          <td>{testscase.name}</td>
          <td className="pf-u-text-align-right col-xs-1">
            {testscase.time}
            &nbsp;ms
          </td>
        </tr>
        {seeDetails ? (
          <tr style={{ borderTop: 0 }}>
            <td colspan={5}>
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
