import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";

export default class FormModal extends Component {
  render() {
    const {
      title,
      show = false,
      close,
      cancelButton = "cancel",
      formRef,
      canSubmit,
      okButton = "create",
      children
    } = this.props;
    return (
      <Modal
        title={title}
        isOpen={show}
        onClose={close}
        isLarge
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            className="btn-cancel"
            onClick={close}
          >
            {cancelButton}
          </Button>,
          <Button
            id="submit-modal-button"
            key="ok"
            variant="primary"
            type="submit"
            form={formRef}
            isDisabled={!canSubmit}
          >
            {okButton}
          </Button>
        ]}
      >
        {children}
      </Modal>
    );
  }
}
