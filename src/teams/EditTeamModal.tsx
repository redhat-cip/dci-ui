import * as React from "react";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
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
        title={`Edit ${team.name}`}
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="edit"
            variant="primary"
            type="submit"
            form="edit-team-form"
          >
            Edit
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <TeamForm
          id="edit-team-form"
          team={team}
          onSubmit={(editedTeam) => {
            onSubmit(editedTeam);
            hide();
          }}
        />
      </Modal>
      {children(show)}
    </>
  );
}
