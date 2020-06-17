import React, { Component } from "react";
import Formsy from "formsy-react";
import { Input, HiddenInput } from "ui/form";
import {
  Button,
  ActionGroup,
  Card,
  CardTitle,
  CardBody,
} from "@patternfly/react-core";

export default class SettingsForm extends Component {
  state = {
    canSubmit: false,
    currentUser: this.props.currentUser,
  };
  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { submit } = this.props;
    const { currentUser, canSubmit } = this.state;
    return (
      <Card>
        <CardTitle>Personal information</CardTitle>
        <CardBody>
          <Formsy
            id="current-user-form"
            className="pf-c-form"
            onValidSubmit={(currentUser) => submit(currentUser)}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput
              id="current-user-form__etag"
              name="etag"
              value={currentUser.etag}
            />
            <Input
              id="current-user-form__email"
              label="Email"
              name="email"
              value={currentUser.email}
              required
            />
            <Input
              id="current-user-form__fullname"
              label="Full name"
              name="fullname"
              value={currentUser.fullname}
              required
            />
            <Input
              id="current-user-form__current_password"
              label="Current password"
              name="current_password"
              type="password"
              value={currentUser.current_password}
              required
            />
            <HiddenInput
              id="current-user-form__new_password"
              label="Current password"
              name="new_password"
              type="password"
              value=""
            />
            <ActionGroup>
              <Button type="submit" isDisabled={!canSubmit}>
                Update your settings
              </Button>
            </ActionGroup>
          </Formsy>
        </CardBody>
      </Card>
    );
  }
}
