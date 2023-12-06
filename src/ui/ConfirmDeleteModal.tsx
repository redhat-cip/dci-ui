import { ReactNode } from "react";
import {
  Button,
  Modal,
  ModalVariant,
  Title,
  TitleSizes,
} from "@patternfly/react-core";
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
        title="Confirm delete modal"
        isOpen={isOpen}
        header={
          <Title headingLevel="h1" size={TitleSizes["2xl"]}>
            <TextRed>{title}</TextRed>
          </Title>
        }
        onClose={hide}
        variant={ModalVariant.small}
      >
        <div>
          <TextRed>{message}</TextRed>
        </div>
        <div className="pf-v5-u-mt-md">
          <Button variant="secondary" className="pf-v5-u-mr-xs" onClick={hide}>
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
}
