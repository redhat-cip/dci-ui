import React, { Component } from "react";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, Select, HiddenInput } from "form";

export default class UserForm extends Component {
  state = {
    canSubmit: false
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { buttonText, submit, teams, user } = this.props;
    const { canSubmit } = this.state;
    return (
      <React.Fragment>
        <Formsy
          id="user-form"
          className="pf-c-form"
          onValidSubmit={submit}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
        >
          <HiddenInput
            id="user-form-etag-field"
            name="etag"
            value={user.etag}
          />
          <Input
            id="user-form-name-field"
            label="Login"
            name="name"
            value={user.name}
            required
          />
          <Input
            id="user-form-fullname-field"
            label="Full name"
            name="fullname"
            value={user.fullname}
            required
          />
          <Input
            id="user-form-email-field"
            label="Email"
            name="email"
            type="email"
            validations="isEmail"
            validationError="This is not a valid email"
            value={user.email}
            required
          />
          <Input
            id="user-form-password-field"
            label="Password"
            name="password"
            type="password"
          />
          <Select
            id="user-form-team-field"
            label="Team"
            name="team_id"
            options={teams}
            value={user.team_id || teams[0].id}
            required
          />
          
          <Button
            id="user-form-submit-button"
            variant="primary"
            type="submit"
            isDisabled={!canSubmit}
          >
            {buttonText}
          </Button>
        </Formsy>
      </React.Fragment>
    );
  }
}
