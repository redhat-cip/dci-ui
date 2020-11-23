import React from "react";
import { useDispatch } from "react-redux";
import FeederForm from "./FeederForm";
import actions from "./feedersActions";
import { EditAltIcon } from "@patternfly/react-icons";
import { IFeeder } from "types";
import { AppDispatch } from "store";

interface EditFeederButtonProps {
  feeder: IFeeder;
  [x: string]: any;
}

export default function EditFeederButton({
  feeder,
  ...props
}: EditFeederButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <FeederForm
      {...props}
      title="Edit feeder"
      feeder={feeder}
      showModalButton={<EditAltIcon />}
      okButton="Edit"
      submit={(newFeeder: IFeeder) => {
        dispatch(
          actions.update({
            ...newFeeder,
            id: feeder.id,
          })
        );
      }}
    />
  );
}
