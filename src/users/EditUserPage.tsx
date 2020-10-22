import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, GridItem, Card, CardBody, Button } from "@patternfly/react-core";
import { LoadingPage, Page } from "layout";
import usersActions from "./usersActions";
import UserForm from "./UserForm";
import {
  fetchUserTeams,
  addUserToTeam,
  deleteUserFromTeam,
} from "./usersActions";
import AddUserToTeamForm from "./AddUserToTeamsForm";
import { TrashIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal } from "ui";
import { AppDispatch } from "store";
import { ITeam, IUser } from "types";
import { useRouteMatch } from "react-router-dom";

type MatchParams = {
  id: string;
};

export default function EditUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<IUser | null>(null);
  const [userTeams, setUserTeams] = useState<ITeam[]>([]);
  const match = useRouteMatch<MatchParams>();
  const { id } = match.params;

  const _fetchUser = useCallback(
    (id) => {
      dispatch(usersActions.one(id)).then((response) => {
        setUser(response.data.user);
      });
    },
    [dispatch, setUser]
  );

  const _fetchUserTeams = useCallback(
    (id) => {
      dispatch(fetchUserTeams({ id: id })).then((response) => {
        setUserTeams(response.data.teams);
      });
    },
    [dispatch, setUserTeams]
  );

  useEffect(() => {
    _fetchUser(id);
    _fetchUserTeams(id);
  }, [id, _fetchUser, _fetchUserTeams]);

  if (user === null) return <LoadingPage title="Edit user ..." />;
  return (
    <Page title={`Edit user ${user.fullname}`}>
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <UserForm
                user={user}
                buttonText="Edit user"
                submit={(u: IUser) => {
                  const { id, ...newUser } = u;
                  dispatch(
                    usersActions.update({
                      ...newUser,
                      id: user.id,
                    })
                  ).then((response) => setUser(response.data.user));
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <AddUserToTeamForm
                onSubmit={(team: ITeam) => {
                  dispatch(addUserToTeam(user, team)).then(() => {
                    _fetchUser(id);
                    _fetchUserTeams(id);
                  });
                }}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <table className="pf-c-table pf-m-compact pf-m-grid-md">
                <thead>
                  <tr>
                    <th>Team name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {userTeams.map((team) => (
                    <tr key={team.id}>
                      <td>{team.name}</td>
                      <td className="pf-c-table__action">
                        <ConfirmDeleteModal
                          title={`Delete ${user.name} from ${team.name}`}
                          message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                          onOk={() => {
                            dispatch(deleteUserFromTeam(user, team)).then(
                              () => {
                                _fetchUser(id);
                                _fetchUserTeams(id);
                              }
                            );
                          }}
                        >
                          {(openModal) => (
                            <Button variant="danger" onClick={openModal}>
                              <TrashIcon />
                            </Button>
                          )}
                        </ConfirmDeleteModal>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Page>
  );
}
