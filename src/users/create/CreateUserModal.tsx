import { useRef } from "react";
import * as React from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import CreateUserForm from "./CreateUserForm";
import { INewUser } from "types";

interface CreateUserModalProps {
  onSubmit: (user: INewUser) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function CreateUserModal({
  onSubmit,
  children,
}: CreateUserModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewUser>>(null);
  return (
    <>
      <Modal
        id="create_user_modal"
        variant={ModalVariant.medium}
        title="Create a new user"
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="create"
            variant="primary"
            onClick={() => {
              hide();
              if (formRef.current) {
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
        <CreateUserForm ref={formRef} onSubmit={onSubmit} />
      </Modal>
      {children(show)}
    </>
  );
}
