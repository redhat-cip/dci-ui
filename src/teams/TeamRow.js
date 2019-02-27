import React from "react";
import { CopyButton, Labels, ConfirmDeleteButton } from "ui";
import EditTeamButton from "./EditTeamButton";

export default function TeamRow({ team, deleteConfirmed }) {
  return (
    <tr>
      <td>
        <CopyButton text={team.id} />
      </td>
      <td>{team.name.toUpperCase()}</td>
      <td>{team.external ? <Labels.Success>partner</Labels.Success> : null}</td>
      <td>{team.parent_team ? team.parent_team.name.toUpperCase() : ""}</td>
      <td>{team.from_now}</td>
      <td className="pf-u-text-align-right">
        <EditTeamButton className="pf-u-mr-xs" team={team} />
        <ConfirmDeleteButton
          title={`Delete team ${team.name}`}
          content={`Are you sure you want to delete ${team.name}?`}
          whenConfirmed={deleteConfirmed}
        />
      </td>
    </tr>
  );
}
