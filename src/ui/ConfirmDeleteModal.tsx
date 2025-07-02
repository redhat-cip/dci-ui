import type { ReactNode } from "react";
import {
  Button,
  Content,
  ContentVariants,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";

type ConfirmDeleteModalProps = {
  onOk: () => void;
  children: (open: () => void) => ReactNode;
  title?: string;
  message?: string;
  okButton?: string;
  cancelButton?: string;
};

export default function ConfirmDeleteModal({
  title = "Are you sure?",
  message = "",
  okButton = "Yes",
  cancelButton = "No",
  onOk,
  children,
}: ConfirmDeleteModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="confirm-delete-modal"
        aria-label="Confirm delete modal"
        isOpen={isOpen}
        onClose={hide}
        variant={ModalVariant.small}
      >
        <ModalHeader>
          <Content
            component={ContentVariants.h2}
            style={{ color: t_global_color_status_danger_default.var }}
          >
            {title}
          </Content>
        </ModalHeader>
        <ModalBody>
          <span style={{ color: t_global_color_status_danger_default.var }}>
            {message}
          </span>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={hide}>
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
        </ModalFooter>
      </Modal>
      {children(show)}
    </>
  );
}
