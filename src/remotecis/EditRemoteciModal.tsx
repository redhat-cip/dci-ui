import React, { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import RemoteciForm from "./RemoteciForm";
import { INewRemoteci, IRemoteci, ITeam } from "types";
import { EditAltIcon } from "@patternfly/react-icons";

interface EditRemoteciModalProps {
  teams: ITeam[];
  remoteci: IRemoteci;
  onSubmit: (remoteci: IRemoteci) => void;
  [x: string]: any;
}

export default function EditRemoteciModal({
  teams,
  remoteci,
  onSubmit,
  ...props
}: EditRemoteciModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewRemoteci>>(null);
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
            onSubmit(editedRemoteci as IRemoteci);
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
