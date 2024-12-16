import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import FeederForm from "./FeederForm";
import { IFeeder } from "types";

interface CreateFeederModalProps {
  onSubmit: (feeder: Partial<IFeeder>) => void;
  [x: string]: any;
}

export default function CreateFeederModal({
  onSubmit,
  ...props
}: CreateFeederModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="create_feeder_modal"
        aria-label="Create feeder modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Create a new feeder" />
        <ModalBody>
          <FeederForm
            id="create-feeder-form"
            onSubmit={(feeder) => {
              hide();
              onSubmit(feeder);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="create-feeder-form"
          >
            Create
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        Create a new feeder
      </Button>
    </>
  );
}
