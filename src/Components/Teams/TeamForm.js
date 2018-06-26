// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.
import React from "react";
import _ from "lodash";
import { connect } from "../../store";
import FormModal from "../FormModal";
import { Button } from "patternfly-react";
import Formsy from "formsy-react";
import Input from "../Form/Input";
import Checkbox from "../Form/Checkbox";
import Select from "../Form/Select";
import { getTeams } from "./selectors";

export class TeamForm extends React.Component {
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
            <Input
              label="Name"
              name="name"
              value={this.state.team.name}
              required
            />
            {_.isEmpty(teams) ? null : (
              <Select
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
