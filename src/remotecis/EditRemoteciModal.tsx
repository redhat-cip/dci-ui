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
import { IRemoteci } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditRemoteciModalProps {
  remoteci: IRemoteci;
  onSubmit: (remoteci: Partial<IRemoteci>) => void;
  [x: string]: any;
}

export default function EditRemoteciModal({
  remoteci,
  onSubmit,
  ...props
}: EditRemoteciModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="edit_remoteci_modal"
        aria-label="Edit remoteci modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title={`Edit ${remoteci.name}`} />
        <ModalBody>
          <RemoteciForm
            id="edit-remoteci-form"
            remoteci={remoteci}
            onSubmit={(editedRemoteci) => {
              hide();
              // todo: why ? dci-control-server api doesnt accept extra field like from_now
              const { id, etag, name, team_id } =
                editedRemoteci as Partial<IRemoteci>;
              onSubmit({
                id,
                etag,
                name,
                team_id,
              });
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="edit"
            variant="primary"
            type="submit"
            form="edit-remoteci-form"
          >
            Edit
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        icon={<EditAltIcon aria-hidden="true" />}
        variant="primary"
        onClick={show}
        {...props}
      >
        Edit
      </Button>
    </>
  );
}
