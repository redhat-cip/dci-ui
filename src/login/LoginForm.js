import React, { Component } from "react";
import Formsy from "formsy-react";
import { Input } from "../form";

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
      >
        <Input label="Username" name="username" required />
        <Input label="Password" name="password" type="password" required />
        <button
          type="submit"
          disabled={!this.state.canSubmit}
          className="btn btn-primary btn-block btn-lg mt-3"
        >
          Login
        </button>
      </Formsy>
    );
  }
}
