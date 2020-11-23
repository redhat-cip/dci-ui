import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { IFeeder } from "types";
import FeederForm from "./FeederForm";
import actions from "./feedersActions";

interface NewFeederButtonProps {
  [x: string]: any;
}

export default function NewFeederButton({ ...props }: NewFeederButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <FeederForm
      title="Create a new feeder"
      showModalButton="Create a new feeder"
      okButton="Create"
      submit={(newFeeder: IFeeder) => {
        dispatch(actions.create(newFeeder));
      }}
      {...props}
    />
  );
}
