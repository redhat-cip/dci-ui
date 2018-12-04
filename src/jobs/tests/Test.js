import React, { Component } from "react";
import TestHeader from "./TestHeader";
import Testscases from "./TestsCases";

export default class Test extends Component {
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
    const { test } = this.props;
    const { seeDetails } = this.state;
    return (
      <div>
        <TestHeader test={test} toggleDetails={this.toggleDetails} />
        {seeDetails ? <Testscases testscases={test.testscases} /> : null}
      </div>
    );
  }
}
