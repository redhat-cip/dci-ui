import React, { Component } from "react";
import FormModal from "../FormModal";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input, Select, HiddenInput } from "../form";
import { isEmpty } from "lodash";

export default class RemoteciForm extends Component {
  state = {
    canSubmit: false,
    show: false,
    remoteci: {
      name: "",
      ...this.props.remoteci
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
      className,
      showModalButton,
      teams
    } = this.props;
    const { canSubmit, show, remoteci } = this.state;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="remoteci-form"
          canSubmit={canSubmit}
          show={show}
          close={this.closeModal}
        >
          <Formsy
            id="remoteci-form"
            className="pf-c-form"
            onValidSubmit={remoteci => {
              this.closeModal();
              submit(remoteci);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput
              id="remoteci-form__etag"
              name="etag"
              value={remoteci.etag}
            />
            <Input
              id="remoteci-form__name"
              label="Name"
              name="name"
              value={remoteci.name}
              required
            />
            {isEmpty(teams) ? null : (
              <Select
                id="remoteci-form__team"
                label="Team Owner"
                name="team_id"
                options={teams}
                value={remoteci.team_id || teams[0].id}
                required
              />
            )}
          </Formsy>
        </FormModal>
        <Button
          variant="primary"
          className={className}
          onClick={this.showModal}
        >
          {showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}
