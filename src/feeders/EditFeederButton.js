import React, { Component } from "react";
import { connect } from "react-redux";
import FeederForm from "./FeederForm";
import actions from "./feedersActions";
import { EditAltIcon } from "@patternfly/react-icons";

export class EditFeederButton extends Component {
  render() {
    const { feeder, editFeeder, ...props } = this.props;
    return (
      <FeederForm
        {...props}
        title="Edit feeder"
        feeder={feeder}
        showModalButton={<EditAltIcon />}
        okButton="Edit"
        submit={newFeeder => {
          editFeeder({
            id: feeder.id,
            ...newFeeder
          });
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editFeeder: feeder => dispatch(actions.update(feeder))
  };
}

export default connect(null, mapDispatchToProps)(EditFeederButton);
