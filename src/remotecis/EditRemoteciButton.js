import React, {Component} from "react";
import { connect } from "react-redux";
import RemoteciForm from "./RemoteciForm";
import actions from "./remotecisActions";

export class EditRemoteciButton extends Component {
  render() {
    const { teams } = this.props;
    return (
      <RemoteciForm
        title="Edit remoteci"
        remoteci={this.props.remoteci}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        teams={teams}
        submit={remoteci => {
          const newRemoteci = {
            id: this.props.remoteci.id,
            ...remoteci
          };
          this.props.editRemoteci(newRemoteci);
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
