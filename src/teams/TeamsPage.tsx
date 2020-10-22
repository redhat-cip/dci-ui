import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { Page } from "layout";
import teamsActions from "./teamsActions";
import usersActions from "users/usersActions";
import { EmptyState } from "ui";
import { getTeams, isFetchingTeams } from "./teamsSelectors";
import Team from "./Team";
import NewTeamModal from "./NewTeamModal";
import { getUsers, isFetchingUsers } from "users/usersSelectors";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { AppDispatch } from "store";

export default function TeamsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
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

  return (
    <Page
      title="Teams"
      loading={isFetching && isEmpty(teams)}
      empty={!isFetching && isEmpty(teams)}
      HeaderButton={
        currentUser.hasEPMRole ? (
          <Button onClick={() => setIsNewTeamModalOpen(true)}>
            <PlusCircleIcon className="mr-xs" />
            Create a new team
          </Button>
        ) : null
      }
      EmptyComponent={
        <EmptyState
          title="There is no teams"
          info="Do you want to create one?"
        />
      }
    >
      <NewTeamModal
        isOpen={isNewTeamModalOpen}
        close={() => setIsNewTeamModalOpen(false)}
        onOk={() => setIsNewTeamModalOpen(false)}
      />
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
