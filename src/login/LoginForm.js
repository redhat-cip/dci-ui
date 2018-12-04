import React, { Component } from "react";
import Formsy from "formsy-react";
import { Input } from "../form";
import {
  Button,
  ActionGroup,
  Toolbar,
  ToolbarGroup
} from "@patternfly/react-core";

export default class LoginForm extends Component {
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
        onValidSubmit={submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        className="pf-c-form"
      >
        <Input label="Username" name="username" required />
        <Input label="Password" name="password" type="password" required />
        <ActionGroup>
          <Toolbar>
            <ToolbarGroup>
              <Button variant="primary" isDisabled={!canSubmit} type="submit">
                Log In
              </Button>
            </ToolbarGroup>
          </Toolbar>
        </ActionGroup>
      </Formsy>
    );
  }
}
