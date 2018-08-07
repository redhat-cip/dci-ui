import React, { Component } from "react";
import { connect } from "react-redux";
import RemoteciForm from "./RemoteciForm";
import actions from "./remotecisActions";

export class EditRemoteciButton extends Component {
  render() {
    const { teams, remoteci, editRemoteci, ...props } = this.props;
    return (
      <RemoteciForm
        {...props}
        title="Edit remoteci"
        remoteci={remoteci}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        teams={teams}
        submit={remoteci => {
          const newRemoteci = {
            id: remoteci.id,
            ...remoteci
          };
          editRemoteci(newRemoteci);
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editRemoteci: remoteci => dispatch(actions.update(remoteci))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditRemoteciButton);
