import React, { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import RemoteciForm from "./RemoteciForm";
import { INewRemoteci, IRemoteci, IEditRemoteci, ITeam } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditRemoteciModalProps {
  teams: ITeam[];
  remoteci: IRemoteci;
  onSubmit: (remoteci: IEditRemoteci) => void;
  [x: string]: any;
}

export default function EditRemoteciModal({
  teams,
  remoteci,
  onSubmit,
  ...props
}: EditRemoteciModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewRemoteci | IEditRemoteci>>(null);
  return (
    <>
      <Modal
        id="edit_remoteci_modal"
        variant={ModalVariant.medium}
        title={`Edit ${remoteci.name}`}
        isOpen={isOpen}
        onClose={hide}
        actions={[
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
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <RemoteciForm
          ref={formRef}
          teams={teams}
          remoteci={remoteci}
          onSubmit={(editedRemoteci) => {
            // why ? dci-control-server api doesnt accept extra field like from_now
            const { id, etag, name, team_id } = editedRemoteci as IEditRemoteci;
            onSubmit({
              id,
              etag,
              name,
              team_id,
            });
          }}
        />
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        <EditAltIcon aria-hidden="true" />
        <span className="sr-only">Edit {remoteci.name}</span>
      </Button>
    </>
  );
}
