import React, { Component } from "react";
import { connect } from "react-redux";
import UserForm from "./UserForm";
import actions from "./usersActions";

export class NewUserButton extends Component {
  render() {
    const { teams, roles } = this.props;
    return (
      <UserForm
        title="Create a new user"
        showModalButton="Create a new user"
        okButton="Create"
        submit={this.props.createUser}
        className={this.props.className}
        teams={teams}
        roles={roles}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createUser: user => dispatch(actions.create(user))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NewUserButton);
