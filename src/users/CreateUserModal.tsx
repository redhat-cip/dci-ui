import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import CreateUserForm from "./UserForm";
import { IUser } from "types";

interface CreateUserModalProps {
  onSubmit: (user: Partial<IUser>) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function CreateUserModal({
  onSubmit,
  children,
}: CreateUserModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="create_user_modal"
        aria-label="Create user modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Create a new user" />
        <ModalBody>
          <CreateUserForm
            id="create-user-form"
            onSubmit={(user) => {
              hide();
              onSubmit(user);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="create-user-form"
          >
            Create
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {children(show)}
    </>
  );
}
