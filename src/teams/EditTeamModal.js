import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { connect } from "react-redux";
import teamsActions from "./teamsActions";
import Formsy from "formsy-react";
import { Input, Checkbox, HiddenInput } from "form";

export class EditTeamModal extends Component {
  state = {
    canSubmit: false,
    team: {
      name: "",
      external: true,
      state: "active",
      ...this.props.team
    }
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
          <Button key="ok" type="submit" disabled={!canSubmit} form="team-form">
            Edit
          </Button>
        ]}
      >
        <Formsy
          id="team-form"
          className="pf-c-form"
          onValidSubmit={newTeam => {
            editTeam({
              id: team.id,
              ...newTeam,
              state: newTeam.state ? "active" : "inactive"
            });
            onOk();
          }}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
        >
          <HiddenInput id="team-form__etag" name="etag" value={team.etag} />
          <Input
            id="team-form__name"
            label="Name"
            name="name"
            value={team.name}
            required
          />
          <Checkbox
            label="Active"
            name="state"
            value={team.state === "active"}
          />
          <Checkbox label="Partner" name="external" value={team.external} />
        </Formsy>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editTeam: team => dispatch(teamsActions.update(team))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditTeamModal);
