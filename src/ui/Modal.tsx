import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { Modal } from "@patternfly/react-core";

type DCIModalProps = {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  close: () => void;
};

const DCIModal = ({ title, children, isOpen, close }: DCIModalProps) =>
  isOpen
    ? ReactDOM.createPortal(
        <Modal title={title} isOpen={isOpen} onClose={close}>
          {children}
        </Modal>,
        document.body
      )
    : null;

export default DCIModal;
