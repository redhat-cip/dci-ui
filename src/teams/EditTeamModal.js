import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { connect } from "react-redux";
import teamsActions from "./teamsActions";
import TeamForm from "./TeamForm";

export class EditTeamModal extends Component {
  state = {
    canSubmit: false,
    team: {
      name: "",
      external: true,
      state: "active",
      ...this.props.team,
    },
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { isOpen, close, editTeam, onOk } = this.props;
    const { team, canSubmit } = this.state;
    return (
      <Modal
        title={`Edit ${team.name} team`}
        isOpen={isOpen}
        onClose={close}
        isSmall
        actions={[
          <Button key="cancel" variant="secondary" onClick={close}>
            Cancel
          </Button>,
          <Button
            key="edit"
            type="submit"
            isDisabled={!canSubmit}
            form="team-form"
          >
            Edit
          </Button>,
        ]}
      >
        <TeamForm
          id="team-form"
          team={team}
          onValidSubmit={(newTeam) => {
            editTeam({
              id: team.id,
              ...newTeam,
            });
            onOk();
          }}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
        />
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editTeam: (team) => dispatch(teamsActions.update(team)),
  };
}

export default connect(null, mapDispatchToProps)(EditTeamModal);
