import { useRef } from "react";
import { FormikProps } from "formik";
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
import { IRemoteci, ITeam } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditRemoteciModalProps {
  teams: ITeam[];
  remoteci: IRemoteci;
  onSubmit: (remoteci: Partial<IRemoteci>) => void;
  [x: string]: any;
}

export default function EditRemoteciModal({
  teams,
  remoteci,
  onSubmit,
  ...props
}: EditRemoteciModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<IRemoteci | Partial<IRemoteci>>>(null);
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
            ref={formRef}
            teams={teams}
            remoteci={remoteci}
            onSubmit={(editedRemoteci) => {
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
            onClick={() => {
              if (formRef.current) {
                if (formRef.current.isValid) {
                  hide();
                }
                formRef.current.handleSubmit();
              }
            }}
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
        Edit remoteci
      </Button>
    </>
  );
}
