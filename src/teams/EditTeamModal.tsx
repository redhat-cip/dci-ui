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

interface EditTeamModalProps {
  team: ITeam;
  onSubmit: (team: ITeam | Partial<ITeam>) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function EditTeamModal({
  team,
  onSubmit,
  children,
}: EditTeamModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="edit_team_modal"
        aria-label="Edit team modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title={`Edit ${team.name}`} />
        <ModalBody>
          <TeamForm
            id="edit-team-form"
            team={team}
            onSubmit={(editedTeam) => {
              onSubmit(editedTeam);
              hide();
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="edit"
            variant="primary"
            type="submit"
            form="edit-team-form"
          >
            Edit
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
