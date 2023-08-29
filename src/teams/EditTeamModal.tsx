import { useRef } from "react";
import * as React from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TeamForm from "./TeamForm";
import { INewTeam, ITeam } from "types";

interface EditTeamModalProps {
  team: ITeam;
  onSubmit: (team: ITeam) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function EditTeamModal({
  team,
  onSubmit,
  children,
}: EditTeamModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewTeam>>(null);
  return (
    <>
      <Modal
        id="edit_team_modal"
        variant={ModalVariant.medium}
        title={`Edit ${team.name}`}
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="edit"
            variant="primary"
            onClick={() => {
              hide();
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
        <TeamForm
          ref={formRef}
          team={team}
          onSubmit={(editedTeam) => {
            onSubmit(editedTeam as ITeam);
          }}
        />
      </Modal>
      {children(show)}
    </>
  );
}
