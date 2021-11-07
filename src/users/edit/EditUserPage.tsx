import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  TextContent,
  Text,
  CardTitle,
} from "@patternfly/react-core";
import { LoadingPage, Page } from "layout";
import usersActions from "../usersActions";
import EditUserForm from "./EditUserForm";
import {
  fetchUserTeams,
  addUserToTeam,
  deleteUserFromTeam,
} from "../usersActions";
import AddUserToTeamForm from "./AddUserToTeamsForm";
import { TrashAltIcon, MinusCircleIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal, Breadcrumb } from "ui";
import { AppDispatch } from "store";
import { ITeam, IUser } from "types";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { global_danger_color_100 } from "@patternfly/react-tokens";

const DangerZone = styled.div`
  border: 1px solid ${global_danger_color_100.value};
  padding: 1rem;
  border-radius: 0.5rem;
`;

const DangerZoneRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function EditUserPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<IUser | null>(null);
  const [userTeams, setUserTeams] = useState<ITeam[]>([]);
  const { id } = useParams();

  const _fetchUser = useCallback(
    (id) => {
      dispatch(usersActions.one(id)).then((response) => {
        setUser(response.data.user);
      });
    },
    [dispatch, setUser]
  );

  const _fetchUserTeams = useCallback((id) => {
    fetchUserTeams({ id: id } as IUser).then((response) => {
      setUserTeams(response.data.teams);
    });
  }, []);

  useEffect(() => {
    if (id) {
      _fetchUser(id);
      _fetchUserTeams(id);
    }
  }, [id, _fetchUser, _fetchUserTeams]);

  if (!id) return null;

  const breadcrumb = (
    <Breadcrumb
      links={[
        { to: "/", title: "DCI" },
        { to: "/users", title: "Users" },
        { to: `/users/${id}`, title: id },
      ]}
    />
  );

  if (user === null) {
    return <LoadingPage title="Edit user" breadcrumb={breadcrumb} />;
  }

  return (
    <Page
      title={`Edit user ${user.fullname}`}
      description={user ? `Details page for user ${user.name}` : "Details page"}
      breadcrumb={breadcrumb}
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <EditUserForm
                user={user}
                onSubmit={(editedUser) => {
                  dispatch(usersActions.update(editedUser as IUser)).then(
                    (response) => setUser(response.data.user)
                  );
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <Card>
            <CardTitle>User teams</CardTitle>
            <CardBody>
              <AddUserToTeamForm
                onSubmit={(team: ITeam) => {
                  addUserToTeam(user.id, team).then(() => {
                    _fetchUser(id);
                    _fetchUserTeams(id);
                  });
                }}
              />
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
                      <td>
                        <Link to={`/teams/${team.id}`}>{team.name}</Link>
                      </td>
                      <td className="pf-c-table__action">
                        <ConfirmDeleteModal
                          title={`Delete ${user.name} from ${team.name}`}
                          message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                          onOk={() => {
                            deleteUserFromTeam(user, team).then(() => {
                              _fetchUser(id);
                              _fetchUserTeams(id);
                            });
                          }}
                        >
                          {(openModal) => (
                            <Button
                              variant="danger"
                              isSmall
                              onClick={openModal}
                            >
                              <MinusCircleIcon />
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
          <Card className="mt-lg">
            <CardTitle>Danger Zone</CardTitle>
            <CardBody>
              <DangerZone>
                <DangerZoneRow>
                  <div>
                    <TextContent>
                      <Text component="h2">{`Delete ${user.name} user`}</Text>
                      <Text component="p">
                        Once you delete a user, there is no going back. Please
                        be certain.
                      </Text>
                    </TextContent>
                  </div>
                  <div>
                    <ConfirmDeleteModal
                      title={`Delete user ${user.name}`}
                      message={`Are you sure you want to delete ${user.name} user?`}
                      onOk={() =>
                        dispatch(usersActions.delete(user)).then(() =>
                          navigate("/users")
                        )
                      }
                    >
                      {(openModal) => (
                        <Button variant="danger" isSmall onClick={openModal}>
                          <TrashAltIcon className="mr-sm" />
                          Delete this user
                        </Button>
                      )}
                    </ConfirmDeleteModal>
                  </div>
                </DangerZoneRow>
              </DangerZone>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Page>
  );
}
