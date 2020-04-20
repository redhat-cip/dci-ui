import React, { ReactNode } from "react";
import { Button } from "@patternfly/react-core";
import { useModal } from "hooks";
import { Modal } from "ui";
import FeederForm, { Feeder } from "./FeederForm2";
import { useSelector, useDispatch } from "react-redux";
import { getTeams } from "teams/teamsSelectors";
import teamsActions from "teams/teamsActions";

type FeederFormModalProps = {
  onSubmit: (d: any) => void;
  children: (open: () => void) => ReactNode;
  title: string;
  submitButton: string;
  cancelButton?: string;
  feeder?: Feeder;
};

const FeederFormModal = ({
  title,
  submitButton,
  cancelButton = "Cancel",
  onSubmit,
  children,
  feeder
}: FeederFormModalProps) => {
  const { isOpen, show, hide } = useModal(false);
  const id = "feeder_form";
  const teams = useSelector(getTeams);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(teamsActions.all());
  }, [dispatch]);
  return (
    <React.Fragment>
      <Modal isOpen={isOpen} title={title} close={hide}>
        <div>
          <FeederForm
            id={id}
            feeder={feeder}
            onSubmit={newFeeder => {
              hide();
              onSubmit(newFeeder);
            }}
            teams={teams}
          />
        </div>
        <div className="pf-u-mt-xl">
          <Button variant="secondary" className="pf-u-mr-xs" onClick={hide}>
            {cancelButton}
          </Button>
          <Button form={id} variant="primary" type="submit">
            {submitButton}
          </Button>
        </div>
      </Modal>
      {children(show)}
    </React.Fragment>
  );
};

export default FeederFormModal;
