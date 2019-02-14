import React, { Component } from "react";
import { connect } from "react-redux";
import UserForm from "./UserForm";
import actions from "./usersActions";
import { EditAltIcon } from "@patternfly/react-icons";

export class EditUserButton extends Component {
  render() {
    const { user, editUser, ...props } = this.props;
    return (
      <UserForm
        {...props}
        title="Edit user"
        user={user}
        showModalButton={<EditAltIcon />}
        okButton="Edit"
        submit={newUser => {
          editUser({
            id: user.id,
            ...newUser
          });
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editUser: user => dispatch(actions.update(user))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditUserButton);
