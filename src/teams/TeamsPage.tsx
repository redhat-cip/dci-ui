import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Page } from "layout";
import teamsActions from "./teamsActions";
import usersActions from "users/usersActions";
import { EmptyState } from "ui";
import { getTeams, isFetchingTeams } from "./teamsSelectors";
import Team from "./Team";
import { getUsers, isFetchingUsers } from "users/usersSelectors";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { AppDispatch } from "store";
import CreateTeamModal from "./CreateTeamModal";

export default function TeamsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector(getTeams);
  const users = useSelector(getUsers);
  const currentUser = useSelector(getCurrentUser);
  const teamsIsFetching = useSelector(isFetchingTeams);
  const usersIsFetching = useSelector(isFetchingUsers);
  const isFetching = teamsIsFetching || usersIsFetching;

  useEffect(() => {
    dispatch(teamsActions.all());
  }, [dispatch]);

  useEffect(() => {
    dispatch(usersActions.all());
  }, [dispatch]);

  if (currentUser === null) return null;

  return (
    <Page
      title="Teams"
      loading={isFetching && isEmpty(teams)}
      empty={!isFetching && isEmpty(teams)}
      HeaderButton={
        currentUser.hasEPMRole ? (
          <CreateTeamModal
            onSubmit={(team) => dispatch(teamsActions.create(team))}
          />
        ) : null
      }
      EmptyComponent={
        <EmptyState
          title="There is no teams"
          info="Do you want to create one?"
        />
      }
    >
      <table
        className="pf-c-table pf-m-expandable pf-m-grid-lg"
        role="grid"
        aria-label="Teams table"
        id="teams-table"
      >
        <thead>
          <tr>
            <td></td>
            <th scope="col">Id</th>
            <th scope="col">Team Name</th>
            <th scope="col">Partner</th>
            <th scope="col">Active</th>
            <th scope="col">Created at</th>
            <td></td>
          </tr>
        </thead>
        {teams.map((team) => (
          <Team
            key={`${team.id}.${team.etag}`}
            team={team}
            users={users}
            currentUser={currentUser}
            deleteTeam={() => dispatch(teamsActions.delete(team))}
          />
        ))}
      </table>
    </Page>
  );
}
