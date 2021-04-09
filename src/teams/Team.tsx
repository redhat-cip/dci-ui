import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import {
  WarningTriangleIcon,
  EditAltIcon,
  PlusCircleIcon,
} from "@patternfly/react-icons";
import {
  Button,
  Label,
  DropdownItem,
  DropdownPosition,
} from "@patternfly/react-core";
import { ConfirmDeleteModal, CopyButton, KebabDropdown, EmptyState } from "ui";
import teamsActions, { fetchUsersForTeam } from "./teamsActions";
import { deleteUserFromTeam, addUserToTeam } from "users/usersActions";
import AddUserToTeamModal from "./AddUserToTeamModal";
import EditTeamModal from "./EditTeamModal";
import { IEnhancedTeam, IEnhancedUser, ICurrentUser, IUser } from "types";
import { AppDispatch } from "store";
import { useHistory } from "react-router-dom";

interface TeamProps {
  team: IEnhancedTeam;
  users: IEnhancedUser[];
  currentUser: ICurrentUser;
  deleteTeam: () => void;
}

export default function Team({
  team,
  users,
  currentUser,
  deleteTeam,
}: TeamProps) {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamUsers, setTeamUsers] = useState<IUser[]>([]);

  const _fetchUsersForTeam = useCallback((team) => {
    return fetchUsersForTeam(team)
      .then((response) => {
        setTeamUsers(response.data.users);
        return response;
      })
      .catch(console.error)
      .then(() => setIsLoading(false));
  }, []);

  if (currentUser === null) return null;

  const getUserDropdownItems = (user: IUser, team: IEnhancedTeam) => {
    const userDropdownItems = [
      <DropdownItem
        key={`edit_user_${user.id}_dropdown`}
        component="button"
        onClick={() => history.push(`/users/${user.id}`)}
      >
        <EditAltIcon className="mr-xs" /> Edit {user.name} user
      </DropdownItem>,
      <DropdownItem
        key={`remove_user_from_team_${user.id}_dropdown`}
        component="button"
        onClick={() => {
          deleteUserFromTeam(user, team);
          _fetchUsersForTeam(team);
        }}
      >
        <WarningTriangleIcon className="mr-xs" /> delete {user.name} user from{" "}
        {team.name} team
      </DropdownItem>,
    ];
    return userDropdownItems;
  };

  const teamDropdownItems = [
    <AddUserToTeamModal
      key="add_user_to_team_dropdown"
      team={team}
      users={users}
      onSubmit={({ user_id }) => {
        addUserToTeam(user_id, team)
          .then(() => _fetchUsersForTeam(team))
          .finally(() => setIsExpanded(true));
      }}
    >
      {(openModal) => (
        <DropdownItem component="button" onClick={openModal}>
          <PlusCircleIcon className="mr-xs" />
          Add a user to {team.name} team
        </DropdownItem>
      )}
    </AddUserToTeamModal>,
    <EditTeamModal
      team={team}
      onSubmit={(team) => dispatch(teamsActions.update(team))}
      key="edit_team_dropdown"
    >
      {(openModal) => (
        <DropdownItem onClick={openModal}>
          <EditAltIcon className="mr-xs" />
          {`edit ${team.name} team`}
        </DropdownItem>
      )}
    </EditTeamModal>,
  ];
  if (currentUser.isSuperAdmin) {
    teamDropdownItems.push(
      <ConfirmDeleteModal
        key="delete_team_dropdown"
        title={`Delete team ${team.name}`}
        message={`Are you sure you want to delete ${team.name} team?`}
        onOk={() => {
          deleteTeam();
        }}
      >
        {(openModal) => (
          <DropdownItem onClick={openModal}>
            <WarningTriangleIcon className="mr-xs" />
            {`delete ${team.name} team`}
          </DropdownItem>
        )}
      </ConfirmDeleteModal>
    );
  }

  return (
    <tbody className={isExpanded ? "pf-m-expanded" : ""}>
      <tr>
        <td className="pf-c-table__toggle">
          <Button
            variant="plain"
            onClick={() => {
              setIsExpanded(!isExpanded);
              setIsLoading(true);
              _fetchUsersForTeam(team);
            }}
          >
            {isExpanded ? (
              <i className="fas fa-angle-down"></i>
            ) : (
              <i className="fas fa-angle-right"></i>
            )}
          </Button>
        </td>
        <th>
          <CopyButton text={team.id} />
        </th>
        <th>{team.name}</th>
        <td>{team.external ? <Label color="blue">partner</Label> : null}</td>
        <td>
          {team.state === "active" ? (
            <Label color="green">active</Label>
          ) : (
            <Label color="red">inactive</Label>
          )}
        </td>
        <td>{team.from_now}</td>
        <td className="pf-c-table__action">
          {currentUser.hasEPMRole && (
            <KebabDropdown
              position={DropdownPosition.right}
              items={teamDropdownItems}
              menuAppendTo={() => document.body}
            />
          )}
        </td>
      </tr>
      <tr
        className={`pf-c-table__expandable-row ${
          isExpanded ? "pf-m-expanded" : ""
        }`}
      >
        <td className="pf-m-no-padding" colSpan={7}>
          <table className="pf-c-table pf-m-compact pf-m-no-border-rows">
            <thead>
              <tr>
                <th>ID</th>
                <th>Login</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isExpanded && isLoading && isEmpty(teamUsers) && (
                <tr>
                  <td>loading...</td>
                </tr>
              )}
              {isExpanded && !isLoading && isEmpty(teamUsers) && (
                <tr>
                  <td>
                    <EmptyState
                      title="No user"
                      info={`There is no user in ${team.name} team`}
                    />
                  </td>
                </tr>
              )}
              {teamUsers.map((user) => (
                <tr key={`${user.id}.${user.etag}`}>
                  <td data-label="Id">
                    <CopyButton text={user.id} />
                  </td>
                  <td data-label="User name">{user.name}</td>
                  <td data-label="User fullname">{user.fullname}</td>
                  <td data-label="User email">{user.email}</td>
                  <td data-label="User created">{user.created_at}</td>
                  <td className="pf-c-table__action">
                    {currentUser.hasEPMRole && (
                      <KebabDropdown
                        position={DropdownPosition.right}
                        items={getUserDropdownItems(user, team)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  );
}
