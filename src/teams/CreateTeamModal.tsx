import * as React from "react";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
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
        title="Create a new team"
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="create-team-form"
          >
            Create
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <TeamForm
          id="create-team-form"
          onSubmit={(user) => {
            hide();
            onSubmit(user);
          }}
        />
      </Modal>
      {children(show)}
    </>
  );
}
