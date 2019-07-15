import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { FilterWithSearch } from "ui";
import { addUserToTeam } from "users/usersActions";

export class AddUserToTeamModal extends Component {
  state = {
    user: null
  };
  render() {
    const { team, users, isOpen, close, addUserToTeam, onOk } = this.props;
    const { user } = this.state;
    if (isEmpty(users)) return null;
    const usersFiltered = users.map(user => ({
      id: user.id,
      key: "user_id",
      name: user.email,
      value: user.id
    }));
    return (
      <Modal
        title={`Add a user to ${team.name} team`}
        isOpen={isOpen}
        onClose={close}
        isSmall
        actions={[
          <Button key="cancel" variant="secondary" onClick={close}>
            Cancel
          </Button>,
          <Button
            key="add"
            disabled={isEmpty(user)}
            onClick={() => {
              addUserToTeam(user, team).then(onOk);
            }}
          >
            Add
          </Button>
        ]}
        style={{ minHeight: "300px" }}
      >
        <FilterWithSearch
          placeholder={isEmpty(user) ? "Select a user" : user.email}
          filter={user}
          filters={usersFiltered}
          onFilterValueSelected={newUser => this.setState({ user: newUser })}
        />
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addUserToTeam: (user, team) => dispatch(addUserToTeam(user, team))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(AddUserToTeamModal);
