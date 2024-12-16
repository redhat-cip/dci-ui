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
import { EditAltIcon } from "@patternfly/react-icons";

interface EditFeederModalProps {
  feeder: IFeeder;
  onSubmit: (feeder: IFeeder | Partial<IFeeder>) => void;
  [x: string]: any;
}

export default function EditFeederModal({
  feeder,
  onSubmit,
  ...props
}: EditFeederModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="edit-feeder-modal"
        aria-label="Edit feeder modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title={`Edit feeder ${feeder.name}`} />
        <ModalBody>
          <FeederForm
            id="edit-feeder-form"
            feeder={feeder}
            onSubmit={(feeder) => {
              hide();
              onSubmit(feeder);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="edit"
            variant="primary"
            type="submit"
            form="edit-feeder-form"
          >
            Edit
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        icon={<EditAltIcon aria-hidden="true" className="pf-v6-u-mr-xs" />}
        variant="primary"
        onClick={show}
        {...props}
      >
        Edit {feeder.name}
      </Button>
    </>
  );
}
