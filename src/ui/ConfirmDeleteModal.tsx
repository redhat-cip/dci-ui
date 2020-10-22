import React, { ReactNode } from "react";
import { Button, Modal } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TextRed from "./Text/TextRed";

type ConfirmDeleteModalProps = {
  onOk: () => void;
  children: (open: () => void) => ReactNode;
  title?: string;
  message?: string;
  okButton?: string;
  cancelButton?: string;
};

const ConfirmDeleteModal = ({
  title = "Are you sure?",
  message = "",
  okButton = "Yes",
  cancelButton = "No",
  onOk,
  children,
}: ConfirmDeleteModalProps) => {
  const { isOpen, show, hide } = useModal(false);
  console.log(isOpen);

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={title}
        onClose={hide}
      >
        <div>
          <TextRed>{message}</TextRed>
        </div>
        <div className="mt--xl">
          <Button variant="secondary" className="mr-xs" onClick={hide}>
            {cancelButton}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              hide();
              onOk();
            }}
          >
            {okButton}
          </Button>
        </div>
      </Modal>
      {children(show)}
    </>
  );
};

export default ConfirmDeleteModal;
