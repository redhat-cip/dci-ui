import React, { Component } from "react";
import { Button } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default class ConfirmDeleteButton extends Component {
  state = {
    isOpen: false
  };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const {
      title,
      children,
      okButton = "yes",
      cancelButton = "oups no!",
      onOk,
      close,
      ...props
    } = this.props;
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <ConfirmDeleteModal
          title={title}
          okButton={okButton}
          cancelButton={cancelButton}
          isOpen={isOpen}
          onOk={onOk}
          close={close}
        >
          {children}
        </ConfirmDeleteModal>
        <Button variant="danger" onClick={this.openModal} {...props}>
          <TrashIcon />
        </Button>
      </React.Fragment>
    );
  }
}
