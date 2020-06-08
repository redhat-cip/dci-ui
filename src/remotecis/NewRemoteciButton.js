import React, { Component } from "react";
import { connect } from "react-redux";
import RemoteciForm from "./RemoteciForm";
import actions from "./remotecisActions";

export class NewRemoteciButton extends Component {
  render() {
    const { teams, createRemoteci, className } = this.props;
    return (
      <RemoteciForm
        title="Create a new remoteci"
        showModalButton="Create a new remoteci"
        okButton="Create"
        submit={createRemoteci}
        className={className}
        teams={teams}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createRemoteci: (remoteci) => dispatch(actions.create(remoteci)),
  };
}

export default connect(null, mapDispatchToProps)(NewRemoteciButton);
