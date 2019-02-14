import React, { Component } from "react";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, HiddenInput, FormModal } from "../form";

export default class UserForm extends Component {
  state = {
    canSubmit: false,
    show: false,
    user: {
      name: "",
      ...this.props.user
    }
  };
  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const {
      title,
      okButton,
      submit,
      showModalButton,
      className,
      ...props
    } = this.props;
    const { canSubmit, show, user } = this.state;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="user-form"
          canSubmit={canSubmit}
          show={show}
          close={this.closeModal}
        >
          <Formsy
            id="user-form"
            className="pf-c-form"
            onValidSubmit={user => {
              this.closeModal();
              submit(user);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput id="user-form__etag" name="etag" value={user.etag} />
            <Input
              id="user-form__name"
              label="Login"
              name="name"
              value={user.name}
              placeholder="jdoe"
              required
            />
            <Input
              id="user-form__fullname"
              label="Full name"
              name="fullname"
              value={user.fullname}
              placeholder="John Doe"
              required
            />
            <Input
              id="user-form__email"
              label="Email"
              name="email"
              type="email"
              validations="isEmail"
              validationError="This is not a valid email"
              value={user.email}
              placeholder="jdoe@redhat.com"
              required
            />
            <Input
              id="user-form__password"
              label="Password"
              name="password"
              type="password"
            />
          </Formsy>
        </FormModal>
        <Button
          id="users-screen__show-modal-button"
          variant="primary"
          className={className}
          onClick={this.showModal}
          {...props}
        >
          {showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}
