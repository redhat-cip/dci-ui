import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { SelectWithSearch } from "ui";
import { addUserToTeam } from "users/usersActions";

export class AddUserToTeamModal extends Component {
  state = {
    user: null,
  };
  render() {
    const { team, users, isOpen, close, addUserToTeam, onOk } = this.props;
    const { user } = this.state;
    if (isEmpty(users)) return null;
    const usersFiltered = users.map((user) => ({
      id: user.id,
      key: "user_id",
      name: user.email,
      value: user.id,
    }));
    return (
      <Modal
        title={`Add a user to ${team.name} team`}
        isOpen={isOpen}
        onClose={close}
        variant="small"
        actions={[
          <Button key="cancel" variant="secondary" onClick={close}>
            Cancel
          </Button>,
          <Button
            key="add"
            isDisabled={isEmpty(user)}
            onClick={() => {
              addUserToTeam(user, team).then(onOk);
            }}
          >
            Add
          </Button>,
        ]}
        style={{ minHeight: "300px" }}
      >
        <SelectWithSearch
          placeholder={isEmpty(user) ? "Select a user" : user.email}
          option={user}
          options={usersFiltered}
          onSelect={(newUser) => this.setState({ user: newUser })}
          onClear={() => {
            this.setState({ user: null });
          }}
        />
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addUserToTeam: (user, team) => dispatch(addUserToTeam(user, team)),
  };
}

export default connect(null, mapDispatchToProps)(AddUserToTeamModal);
