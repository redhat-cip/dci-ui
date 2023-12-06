import { useState } from "react";
import { Modal, ModalVariant } from "@patternfly/react-core";
import { ITeam } from "types";
import useModal from "hooks/useModal";
import { TeamSelect } from "jobs/toolbar/TeamFilter";

interface AddRemoteTeamPermissionModalProps {
  team: ITeam;
  onTeamSelected: (team: ITeam) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function AddRemoteTeamPermissionModal({
  team,
  onTeamSelected,
  children,
}: AddRemoteTeamPermissionModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const [teamId, setTeamId] = useState<string | null>(null);

  const onClear = () => {
    setTeamId(null);
  };

  return (
    <>
      <Modal
        id="add_remote_team_permission_modal"
        aria-label="Add remote team permission modal"
        variant={ModalVariant.medium}
        title={`Select the teams for which the ${team.name} team can see the components`}
        isOpen={isOpen}
        onClose={() => {
          onClear();
          hide();
        }}
      >
        <TeamSelect
          teamId={teamId}
          filteredTeamsIds={[team.id]}
          onClear={() => onClear()}
          onSelect={(team) => {
            hide();
            onTeamSelected(team);
          }}
          menuAppendTo={() => document.body}
        />
      </Modal>
      {children(show)}
    </>
  );
}
