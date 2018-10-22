import React, { Component } from "react";
import { isEmpty } from "lodash";
import FormModal from "../FormModal";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, Select, HiddenInput } from "../form";

export default class UserForm extends Component {
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
            className="pf-c-form"
            onValidSubmit={user => {
              this.closeModal();
              submit(user);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput
              id="user-form__etag"
              name="etag"
              value={this.state.user.etag}
            />
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
              value={this.state.user.fullname}
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
            />
            {isEmpty(teams) ? null : (
              <Select
                id="user-form__team"
                label="Team"
                name="team_id"
                options={teams}
                value={this.state.user.team_id || teams[0].id}
                required
              />
            )}
            {isEmpty(roles) ? null : (
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
          variant="primary"
          className={this.props.className}
          onClick={this.showModal}
        >
          {this.props.showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}
