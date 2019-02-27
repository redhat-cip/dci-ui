import React from "react";
import { CopyButton, ConfirmDeleteButton } from "ui";
import EditUserButton from "./EditUserButton";

export default function UserRow({ user, isDisabled, deleteConfirmed }) {
  return (
    <tr>
      <td>
        <CopyButton text={user.id} />
      </td>
      <td>{user.name}</td>
      <td>{user.fullname}</td>
      <td>{user.email}</td>
      <td>{user.from_now}</td>
      <td className="pf-u-text-align-right">
        <EditUserButton
          className="pf-u-mr-xs"
          user={user}
          isDisabled={isDisabled}
        />
        <ConfirmDeleteButton
          title={`Delete user ${user.name}`}
          content={`Are you sure you want to delete ${user.name}?`}
          whenConfirmed={deleteConfirmed}
          isDisabled={isDisabled}
        />
      </td>
    </tr>
  );
}
