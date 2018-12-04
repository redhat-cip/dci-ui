import React, { Component } from "react";
import ConfirmModal from "./ConfirmModal";
import { Button } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";

export default class ConfirmDeleteButton extends Component {
  state = {
    show: false
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
      content,
      okButton,
      cancelButton,
      whenConfirmed,
      ...props
    } = this.props;
    return (
      <React.Fragment>
        <ConfirmModal
          title={title}
          okButton={okButton ? okButton : "yes"}
          cancelButton={cancelButton ? cancelButton : "oups no!"}
          show={this.state.show}
          close={this.closeModal}
          onValidSubmit={() => {
            this.closeModal();
            whenConfirmed();
          }}
        >
          {content ? content : ""}
        </ConfirmModal>
        <Button variant="danger" onClick={this.showModal} {...props}>
          <TrashIcon />
        </Button>
      </React.Fragment>
    );
  }
}
