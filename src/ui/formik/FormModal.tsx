import React, { ReactNode } from "react";
import { Button, Modal } from "@patternfly/react-core";
import useModal from "hooks/useModal";

type FormModalProps = {
  title: string;
  formId: string;
  okButton?: string;
  cancelButton?: string;
  children: (open: () => void) => ReactNode;
  Form: ReactNode;
  canSubmit?: boolean;
};

export default function FormModal({
  title,
  formId,
  canSubmit = true,
  okButton = "create",
  cancelButton = "cancel",
  Form,
  children,
}: FormModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        isOpen={isOpen}
        title={title}
        onClose={hide}
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            className="btn-cancel"
            onClick={hide}
          >
            {cancelButton}
          </Button>,
          <Button
            id="submit-modal-button"
            key="ok"
            variant="primary"
            type="submit"
            form={formId}
            isDisabled={!canSubmit}
          >
            {okButton}
          </Button>,
        ]}
      >
        {Form}
      </Modal>
      {children(show)}
    </>
  );
}
