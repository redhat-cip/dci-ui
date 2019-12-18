import React, { Component } from "react";
import { connect } from "react-redux";
import TestHeader from "./TestHeader";
import Testscases from "./TestsCases";
import { getTestsCases } from "./testsActions";

export class Test extends Component {
  state = {
    testscases: [],
    seeDetails: false
  };

  toggleDetails = () => {
    const { getTestsCases, test } = this.props;
    const { seeDetails } = this.state;
    if (seeDetails) {
      this.setState({
        seeDetails: false
      });
    } else {
      getTestsCases({ id: test.file_id }).then(response =>
        this.setState({
          seeDetails: true,
          testscases: response.data.testscases
        })
      );
    }
  };

  render() {
    const { test } = this.props;
    const { seeDetails, testscases } = this.state;
    return (
      <div>
        <TestHeader test={test} toggleDetails={this.toggleDetails} />
        {seeDetails ? <Testscases testscases={testscases} /> : null}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getTestsCases: file => dispatch(getTestsCases(file))
  };
}

export default connect(null, mapDispatchToProps)(Test);
