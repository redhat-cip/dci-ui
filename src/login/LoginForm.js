import React, { Component } from "react";
import Formsy from "formsy-react";
import { Input } from "../form";
import { Button } from "@patternfly/react-core";

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
        <div className="pf-c-form__group pf-m-action pf-u-align-items-center pf-u-display-flex pf-u-flex-direction-column pf-u-flex-direction-row-on-md">
          <Button
            variant="primary"
            isDisabled={!this.state.canSubmit}
            type="submit"
          >
            Log In
          </Button>
        </div>
      </Formsy>
    );
  }
}
