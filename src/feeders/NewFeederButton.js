import React, { Component } from "react";
import { connect } from "react-redux";
import FeederForm from "./FeederForm";
import actions from "./feedersActions";

export class NewFeederButton extends Component {
  render() {
    const { createFeeder, className } = this.props;
    return (
      <FeederForm
        title="Create a new feeder"
        showModalButton="Create a new feeder"
        okButton="Create"
        submit={createFeeder}
        className={className}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createFeeder: feeder => dispatch(actions.create(feeder))
  };
}

export default connect(null, mapDispatchToProps)(NewFeederButton);
