import React, { Component } from "react";
import FormModal from "../../FormModal";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import { Input } from "../../form";

export default class IssueForm extends Component {
  state = {
    canSubmit: false,
    show: false,
    issue: {
      url: "",
      ...this.props.issue
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
    const { title, okButton, submit, showModalButton } = this.props;
    const { canSubmit, show, issue } = this.state;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="issue-form"
          canSubmit={canSubmit}
          show={show}
          close={this.closeModal}
        >
          <Formsy
            id="issue-form"
            className="pf-c-form"
            onValidSubmit={issue => {
              this.closeModal();
              submit(issue);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <Input
              id="issue-form__url"
              label="Url"
              name="url"
              value={issue.url}
              validations="isUrl"
              validationError="This is not a valid url"
              required
            />
          </Formsy>
        </FormModal>
        <Button variant="primary" onClick={this.showModal}>
          {showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}
