import React, { Component } from "react";
import styled from "styled-components";
import { Colors } from "../../ui";
import { Label } from "patternfly-react";
import { TimesIcon } from "@patternfly/react-icons";

const LabelRegression = styled(Label)`
  background-color: ${Colors.purple300};
`;

export default class Testcases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seeDetails: false
    };
  }

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
            {seeDetails ? (
              <span className="fa fa-caret-down code__icon" />
            ) : (
              <span className="fa fa-caret-right code__icon" />
            )}
          </td>
          <td>
            {testscase.action === "skipped" ? (
              <Label bsStyle="warning">Skip</Label>
            ) : null}
            {testscase.action === "failure" ? (
              <Label bsStyle="danger">Failure</Label>
            ) : null}
            {testscase.action === "error" ? (
              <Label bsStyle="danger">Error</Label>
            ) : null}
            {testscase.action === "passed" ? (
              <Label bsStyle="success">Pass</Label>
            ) : null}
            {testscase.regression ? (
              <LabelRegression>Regression</LabelRegression>
            ) : null}
          </td>
          <td>{testscase.classname || testscase.name}</td>
          <td>{testscase.name}</td>
          <td className="pf-u-text-align-right col-xs-1">{testscase.time} ms</td>
        </tr>
        {seeDetails ? (
          <tr style={{ borderTop: 0 }}>
            <td colspan={5}>
              <b>Type:</b> {testscase.type}
              <br />
              <b>Message:</b> {testscase.message}
              <br />
              <b>Value:</b>
              <pre>{testscase.value}</pre>
            </td>
          </tr>
        ) : null}
      </React.Fragment>
    );
  }
}
