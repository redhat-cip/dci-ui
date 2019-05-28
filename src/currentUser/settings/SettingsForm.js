import React, { Component } from "react";
import Formsy from "formsy-react";
import { Input, Select, HiddenInput } from "form";
import moment from "moment-timezone/builds/moment-timezone-with-data-2012-2022";
import {
  Button,
  ActionGroup,
  Toolbar,
  ToolbarGroup,
  Card,
  CardHeader,
  CardBody
} from "@patternfly/react-core";

export default class SettingsForm extends Component {
  state = {
    canSubmit: false,
    currentUser: this.props.currentUser,
    timezones: moment.tz.names().map(timezone => ({
      id: timezone,
      name: timezone
    }))
  };
  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { submit } = this.props;
    const { currentUser, timezones, canSubmit } = this.state;
    return (
      <Card>
        <CardHeader>Personal information</CardHeader>
        <CardBody>
          <Formsy
            id="current-user-form"
            className="pf-c-form"
            onValidSubmit={currentUser => submit(currentUser)}
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
            <Select
              id="current-user-form__currentUser"
              label="Time zone"
              name="timezone"
              options={timezones}
              value={currentUser.timezone}
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
              <Toolbar>
                <ToolbarGroup>
                  <Button type="submit" disabled={!canSubmit}>
                    Update your settings
                  </Button>
                </ToolbarGroup>
              </Toolbar>
            </ActionGroup>
          </Formsy>
        </CardBody>
      </Card>
    );
  }
}
