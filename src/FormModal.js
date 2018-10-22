import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";

export default class ModalForm extends Component {
  render() {
    const {
      title,
      show=false,
      close,
      cancelButton="cancel",
      formRef,
      canSubmit,
      okButton="create",
      children
    } = this.props;
    return (
      <Modal
        title={title}
        isOpen={show}
        onClose={close}
        isLarge
        actions={[
          <Button variant="primary" className="btn-cancel" onClick={close}>
            {cancelButton}
          </Button>,
          <Button
            id="submit-modal-button"
            variant="primary"
            type="submit"
            form={formRef}
            disabled={!canSubmit}
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
