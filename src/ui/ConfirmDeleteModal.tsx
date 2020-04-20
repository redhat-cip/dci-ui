import React, { ReactNode } from "react";
import { Button } from "@patternfly/react-core";
import { useModal } from "../hooks";
import Modal from "./Modal";
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
  children
}: ConfirmDeleteModalProps) => {
  const { isOpen, show, hide } = useModal(false);
  return (
    <React.Fragment>
      <Modal isOpen={isOpen} title={title} close={hide}>
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
    </React.Fragment>
  );
};

export default ConfirmDeleteModal;
