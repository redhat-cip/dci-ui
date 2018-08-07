import React, { Component } from "react";
import { Button } from "patternfly-react";
import Formsy from "formsy-react";
import { Input, Select, HiddenInput } from "../form";
import moment from "moment-timezone/builds/moment-timezone-with-data-2012-2022";

export default class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      currentUser: this.props.currentUser,
      timezones: moment.tz.names().map(timezone => ({
        id: timezone,
        name: timezone
      }))
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
        id="profile-form"
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
          id="profile-form__email"
          label="Email"
          name="email"
          value={this.state.currentUser.email}
          required
        />
        <Input
          id="profile-form__fullname"
          label="Full name"
          name="fullname"
          value={this.state.currentUser.fullname}
          required
        />
        <Select
          id="profile-form__currentUser"
          label="Time zone"
          name="timezone"
          options={this.state.timezones}
          value={this.state.currentUser.timezone}
          required
        />
        <Input
          id="profile-form__current_password"
          label="Current password"
          name="current_password"
          type="password"
          value={this.state.currentUser.current_password}
          required
        />
        <HiddenInput
          id="profile-form__new_password"
          label="Current password"
          name="new_password"
          type="password"
          value=""
        />
        <Button
          type="submit"
          bsStyle="primary"
          disabled={!this.state.canSubmit}
        >
          Update your settings
        </Button>
      </Formsy>
    );
  }
}
