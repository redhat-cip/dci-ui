import { useRef } from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import RemoteciForm from "./RemoteciForm";
import { IRemoteci, ITeam } from "types";

interface CreateRemoteciModalProps {
  teams: ITeam[];
  onSubmit: (remoteci: Partial<IRemoteci>) => void;
  [x: string]: any;
}

export default function CreateRemoteciModal({
  teams,
  onSubmit,
  ...props
}: CreateRemoteciModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<Partial<IRemoteci>>>(null);
  return (
    <>
      <Modal
        id="create_remoteci_modal"
        aria-label="Create remoteci modal"
        variant={ModalVariant.medium}
        title="Create a new remoteci"
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="create"
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
            Create
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <RemoteciForm ref={formRef} teams={teams} onSubmit={onSubmit} />
      </Modal>
      <Button variant="primary" onClick={show} {...props}>
        Create a new remoteci
      </Button>
    </>
  );
}
