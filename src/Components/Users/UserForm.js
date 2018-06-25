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
import Select from "../Form/Select";
import { getTeams } from "../Teams/selectors";
import { getRoles } from "../Roles/selectors";

export class UserForm extends React.Component {
  constructor(props) {
    super(props);
    const initialUser = { name: "" };
    this.state = {
      canSubmit: false,
      show: false,
      user: {
        ...initialUser,
        ...this.props.user
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
    const { title, okButton, submit, teams, roles } = this.props;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="user-form"
          canSubmit={this.state.canSubmit}
          show={this.state.show}
          close={this.closeModal}
        >
          <Formsy
            id="user-form"
            onValidSubmit={user => {
              this.closeModal();
              submit(user);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <Input
              id="user-form__name"
              label="Login"
              name="name"
              value={this.state.user.name}
              required
            />
            <Input
              id="user-form__fullname"
              label="Full name"
              name="fullname"
              value={this.state.user.name}
              required
            />
            <Input
              id="user-form__email"
              label="Email"
              name="email"
              type="email"
              validations="isEmail"
              validationError="This is not a valid email"
              value={this.state.user.email}
              required
            />
            <Input
              id="user-form__password"
              label="Password"
              name="password"
              type="password"
              required
            />
            {_.isEmpty(teams) ? null : (
              <Select
                id="user-form__team"
                label="Team"
                name="team_id"
                options={teams}
                value={this.state.user.team_id || teams[0].id}
                required
              />
            )}
            {_.isEmpty(roles) ? null : (
              <Select
                id="user-form__role"
                label="Role"
                name="role_id"
                options={roles}
                value={this.state.user.role_id || roles[0].id}
                required
              />
            )}
          </Formsy>
        </FormModal>
        <Button
          id="users-screen__show-modal-button"
          bsStyle="primary"
          className={this.props.className}
          onClick={this.showModal}
        >
          {this.props.showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: getTeams(state),
    roles: getRoles(state)
  };
}

export default connect(mapStateToProps)(UserForm);
