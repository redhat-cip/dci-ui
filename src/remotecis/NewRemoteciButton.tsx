import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { IRemoteci, ITeam } from "types";
import RemoteciForm from "./RemoteciForm";
import actions from "./remotecisActions";

interface NewRemoteciButtonProps {
  teams: ITeam[];
  [x: string]: any;
}

export default function NewRemoteciButton({
  teams,
  ...props
}: NewRemoteciButtonProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <RemoteciForm
      title="Create a new remoteci"
      showModalButton="Create a new remoteci"
      okButton="Create"
      submit={(newRemoteci: IRemoteci) => {
        dispatch(actions.create(newRemoteci));
      }}
      teams={teams}
      {...props}
    />
  );
}
