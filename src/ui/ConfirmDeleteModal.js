import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";

export default class ConfirmDeleteModal extends Component {
  render() {
    const {
      title,
      children,
      okButton = "yes",
      cancelButton = "oups no!",
      isOpen = false,
      onOk,
      close,
      ...props
    } = this.props;
    return (
      <Modal
        title={title}
        isOpen={isOpen}
        onClose={close}
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            className="btn-cancel"
            onClick={close}
          >
            {cancelButton}
          </Button>,
          <Button key="ok" variant="danger" onClick={onOk}>
            {okButton}
          </Button>
        ]}
        {...props}
      >
        {children ? children : ""}
      </Modal>
    );
  }
}
