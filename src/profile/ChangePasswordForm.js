import React, { Component } from "react";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, HiddenInput } from "../form";

export default class ChangePasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      currentUser: this.props.currentUser,
      current_password: "",
      new_password: ""
    };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { submit } = this.props;
    return (
      <Formsy
        id="change-password-form"
        className="pf-c-form"
        onValidSubmit={currentUser => submit(currentUser)}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <HiddenInput
          id="profile-form__etag"
          name="etag"
          value={this.state.currentUser.etag}
        />
        <Input
          id="change-password-form__current_password"
          label="Current password"
          name="current_password"
          type="password"
          value={this.state.current_password}
          required
        />
        <Input
          id="change-password-form__new_password"
          label="New password"
          name="new_password"
          type="password"
          value={this.state.new_password}
          required
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!this.state.canSubmit}
        >
          Change your password
        </Button>
      </Formsy>
    );
  }
}
