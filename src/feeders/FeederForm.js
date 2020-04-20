import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, Select, HiddenInput, FormModal } from "ui/form";
import { getTeams } from "teams/teamsSelectors";
import { isEmpty } from "lodash";

export class FeederForm extends Component {
  state = {
    canSubmit: false,
    show: false,
    feeder: {
      name: "",
      ...this.props.feeder
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
      className,
      showModalButton,
      teams
    } = this.props;
    const { canSubmit, show, feeder } = this.state;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="feeder-form"
          canSubmit={canSubmit}
          show={show}
          close={this.closeModal}
        >
          <Formsy
            id="feeder-form"
            className="pf-c-form"
            onValidSubmit={feeder => {
              this.closeModal();
              submit(feeder);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput
              id="feeder-form__etag"
              name="etag"
              value={feeder.etag}
            />
            <Input
              id="feeder-form__name"
              label="Name"
              name="name"
              value={feeder.name}
              required
            />
            {isEmpty(teams) ? null : (
              <Select
                id="feeder-form__team"
                label="Team Owner"
                name="team_id"
                options={teams}
                value={feeder.team_id || teams[0].id}
                required
              />
            )}
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

export default connect(mapStateToProps)(FeederForm);
