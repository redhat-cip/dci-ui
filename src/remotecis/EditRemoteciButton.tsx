import React from "react";
import { useDispatch } from "react-redux";
import RemoteciForm from "./RemoteciForm";
import actions from "./remotecisActions";
import { EditAltIcon } from "@patternfly/react-icons";
import { IRemoteci, ITeam } from "types";
import { AppDispatch } from "store";

interface EditRemoteciButtonProps {
  teams: ITeam[];
  remoteci: IRemoteci;
  [x: string]: any;
}

export default function EditRemoteciButton({
  teams,
  remoteci,
  ...props
}: EditRemoteciButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <RemoteciForm
      {...props}
      title="Edit remoteci"
      remoteci={remoteci}
      showModalButton={<EditAltIcon />}
      okButton="Edit"
      teams={teams}
      submit={(newRemoteci: IRemoteci) => {
        dispatch(
          actions.update({
            ...newRemoteci,
            id: remoteci.id,
          })
        );
      }}
    />
  );
}
