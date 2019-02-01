import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, Select, Checkbox, HiddenInput, FormModal } from "../form";
import { getTeams } from "./teamsSelectors";

export class TeamForm extends Component {
  state = {
    canSubmit: false,
    show: false,
    team: {
      name: "",
      external: true,
      ...this.props.team
    }
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const {
      title,
      okButton,
      submit,
      teams,
      className,
      showModalButton
    } = this.props;
    const { canSubmit, show, team } = this.state;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="team-form"
          canSubmit={canSubmit}
          show={show}
          close={this.closeModal}
        >
          <Formsy
            id="team-form"
            className="pf-c-form"
            onValidSubmit={team => {
              this.closeModal();
              submit(team);
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
            {isEmpty(teams) ? null : (
              <Select
                id="team-form__team"
                label="Parent team"
                name="parent_id"
                options={teams}
                value={team.parent_id || teams[0].id}
                required
              />
            )}
            <Checkbox label="Partner" name="external" value={team.external} />
          </Formsy>
        </FormModal>
        <Button
          variant="primary"
          className={className}
          onClick={this.showModal}
        >
          {showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state)
  };
}

export default connect(mapStateToProps)(TeamForm);
