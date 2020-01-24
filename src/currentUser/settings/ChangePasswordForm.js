import React, { Component } from "react";
import {
  Button,
  ActionGroup,
  Toolbar,
  ToolbarGroup,
  Card,
  CardHeader,
  CardBody,
  Form
} from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, HiddenInput } from "ui/form";

export default class ChangePasswordForm extends Component {
  state = {
    canSubmit: false,
    currentUser: this.props.currentUser,
    current_password: "",
    new_password: ""
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { submit } = this.props;
    const {
      currentUser,
      current_password,
      new_password,
      canSubmit
    } = this.state;
    return (
      <Card>
        <CardHeader>Change your password</CardHeader>
        <CardBody>
          <Formsy
            id="change-password-form"
            onValidSubmit={currentUser => submit(currentUser)}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <Form>
              <HiddenInput
                id="current-user-form__etag"
                name="etag"
                value={currentUser.etag}
              />
              <Input
                id="change-password-form__current_password"
                label="Current password"
                name="current_password"
                type="password"
                value={current_password}
                required
              />
              <Input
                id="change-password-form__new_password"
                label="New password"
                name="new_password"
                type="password"
                value={new_password}
                required
              />
              <ActionGroup>
                <Toolbar>
                  <ToolbarGroup>
                    <Button
                      type="submit"
                      variant="primary"
                      isDisabled={!canSubmit}
                    >
                      Change your password
                    </Button>
                  </ToolbarGroup>
                </Toolbar>
              </ActionGroup>
            </Form>
          </Formsy>
        </CardBody>
      </Card>
    );
  }
}
