import React from "react";
import { useDispatch } from "react-redux";
import FeederFormModal from "./FeederFormModal";
import actions from "./feedersActions";
import { Button } from "@patternfly/react-core";

const NewFeederButton = ({ className }) => {
  const dispatch = useDispatch();
  return (
    <FeederFormModal
      title="Create a new feeder"
      submitButton="Create"
      onSubmit={feeder => dispatch(actions.create(feeder))}
    >
      {show => (
        <Button variant="primary" className={className} onClick={show}>
          Create a new feeder
        </Button>
      )}
    </FeederFormModal>
  );
};

export default NewFeederButton;
