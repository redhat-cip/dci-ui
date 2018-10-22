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
  constructor(props) {
    super(props);
    this.state = { canSubmit: false };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    return (
      <Formsy
        onValidSubmit={this.props.submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        className="pf-c-form"
      >
        <Input label="Username" name="username" required />
        <Input label="Password" name="password" type="password" required />
        <ActionGroup>
          <Toolbar>
            <ToolbarGroup>
              <Button
                variant="primary"
                isDisabled={!this.state.canSubmit}
                type="submit"
              >
                Log In
              </Button>
            </ToolbarGroup>
          </Toolbar>
        </ActionGroup>
      </Formsy>
    );
  }
}
