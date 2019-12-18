import React, { Component } from "react";
import { connect } from "react-redux";
import RemoteciForm from "./RemoteciForm";
import actions from "./remotecisActions";
import { EditAltIcon } from "@patternfly/react-icons";

export class EditRemoteciButton extends Component {
  render() {
    const { teams, remoteci, editRemoteci, ...props } = this.props;
    return (
      <RemoteciForm
        {...props}
        title="Edit remoteci"
        remoteci={remoteci}
        showModalButton={<EditAltIcon />}
        okButton="Edit"
        teams={teams}
        submit={newRemoteci => {
          editRemoteci({
            id: remoteci.id,
            ...newRemoteci
          });
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

export default connect(null, mapDispatchToProps)(EditRemoteciButton);
