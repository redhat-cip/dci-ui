import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import RemoteciForm from "./RemoteciForm";
import type { IRemoteci } from "types";

interface CreateRemoteciModalProps {
  onSubmit: (remoteci: Partial<IRemoteci>) => void;
  [x: string]: any;
}

export default function CreateRemoteciModal({
  onSubmit,
  ...props
}: CreateRemoteciModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="create_remoteci_modal"
        aria-label="Create remoteci modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Create a new remoteci" />
        <ModalBody>
          <RemoteciForm
            id="create-remoteci-form"
            onSubmit={(remoteci) => {
              hide();
              onSubmit(remoteci);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="create-remoteci-form"
          >
            Create
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Button variant="primary" onClick={show} {...props}>
        Create a new remoteci
      </Button>
    </>
  );
}
