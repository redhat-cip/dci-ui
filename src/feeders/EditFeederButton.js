import React from "react";
import { useDispatch } from "react-redux";
import FeederFormModal from "./FeederFormModal";
import actions from "./feedersActions";
import { Button } from "@patternfly/react-core";

const EditFeederButton = ({ feeder, ...props }) => {
  const dispatch = useDispatch();
  return (
    <FeederFormModal
      title="Create a new feeder"
      submitButton="Create"
      feeder={feeder}
      onSubmit={newFeeder => dispatch(actions.update(newFeeder))}
    >
      {show => (
        <Button variant="primary" onClick={show} {...props}>
          Edit feeder
        </Button>
      )}
    </FeederFormModal>
  );
};

export default EditFeederButton;
