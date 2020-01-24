import React, { Component } from "react";
import Formsy from "formsy-react";
import { Input } from "ui/form";
import { Button } from "@patternfly/react-core";

export default class DCILoginForm extends Component {
  state = { canSubmit: false };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { submit } = this.props;
    const { canSubmit } = this.state;
    return (
      <Formsy
        className="pf-c-form"
        onValidSubmit={submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <Input label="Username" name="username" required />
        <Input label="Password" name="password" type="password" required />
        <Button variant="primary" isDisabled={!canSubmit} type="submit">
          Log in
        </Button>
      </Formsy>
    );
  }
}
