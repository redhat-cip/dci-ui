import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import FormModal from "../FormModal";
import { Button } from "patternfly-react";
import Formsy from "formsy-react";
import { Input, Select, Checkbox, HiddenInput } from "../form";
import { getTeams } from "./teamsSelectors";

export class TeamForm extends Component {
  constructor(props) {
    super(props);
    const initialTeam = { name: "", external: true };
    this.state = {
      canSubmit: false,
      show: false,
      team: {
        ...initialTeam,
        ...this.props.team
      }
    };
  }

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
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="team-form"
          canSubmit={this.state.canSubmit}
          show={this.state.show}
          close={this.closeModal}
        >
          <Formsy
            id="team-form"
            onValidSubmit={team => {
              this.closeModal();
              submit(team);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput
              id="team-form__etag"
              name="etag"
              value={this.state.team.etag}
            />
            <Input
              id="team-form__name"
              label="Name"
              name="name"
              value={this.state.team.name}
              required
            />
            {isEmpty(teams) ? null : (
              <Select
                id="team-form__team"
                label="Parent team"
                name="parent_id"
                options={teams}
                value={this.state.team.parent_id || teams[0].id}
                required
              />
            )}
            <Checkbox
              label="Partner"
              name="external"
              value={this.state.team.external || true}
            />
          </Formsy>
        </FormModal>
        <Button
          bsStyle="primary"
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
