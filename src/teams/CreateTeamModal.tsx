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
import TeamForm from "./TeamForm";
import { ITeam } from "types";

interface CreateTeamModalProps {
  onSubmit: (team: Partial<ITeam>) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function CreateTeamModal({
  onSubmit,
  children,
}: CreateTeamModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="create_team_modal"
        aria-label="Create team modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Create a new team" />
        <ModalBody>
          <TeamForm
            id="create-team-form"
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
            form="create-team-form"
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
