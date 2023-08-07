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
import MainPage from "pages/MainPage";
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
import LoadingPage from "pages/LoadingPage";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

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
  const { user_id } = useParams();

  const _fetchUser = useCallback(
    (id: string) => {
      dispatch(usersActions.one(id)).then((response) => {
        setUser(response.data.user);
      });
    },
    [dispatch, setUser],
  );

  const _fetchUserTeams = useCallback((id: string) => {
    fetchUserTeams({ id: id } as IUser).then((response) => {
      setUserTeams(response.data.teams);
    });
  }, []);

  useEffect(() => {
    if (user_id) {
      _fetchUser(user_id);
      _fetchUserTeams(user_id);
    }
  }, [user_id, _fetchUser, _fetchUserTeams]);

  if (!user_id) return null;

  const breadcrumb = (
    <Breadcrumb
      links={[
        { to: "/", title: "DCI" },
        { to: "/users", title: "Users" },
        { to: `/users/${user_id}`, title: user_id },
      ]}
    />
  );

  if (user === null) {
    return <LoadingPage title="Edit user" Breadcrumb={breadcrumb} />;
  }

  return (
    <MainPage
      title={`Edit user ${user.fullname}`}
      description={user ? `Details page for user ${user.name}` : "Details page"}
      Breadcrumb={breadcrumb}
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <EditUserForm
                user={user}
                onSubmit={(editedUser) => {
                  dispatch(usersActions.update(editedUser as IUser)).then(
                    (response) => setUser(response.data.user),
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
                    _fetchUser(user_id);
                    _fetchUserTeams(user_id);
                  });
                }}
              />
              <Table className="pf-v5-c-table pf-m-compact pf-m-grid-md">
                <Thead>
                  <Tr>
                    <Th>Team name</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {userTeams.map((team) => (
                    <Tr key={team.id}>
                      <Td>
                        <Link to={`/teams/${team.id}`}>{team.name}</Link>
                      </Td>
                      <Td className="pf-v5-c-table__action">
                        <ConfirmDeleteModal
                          title={`Delete ${user.name} from ${team.name}`}
                          message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                          onOk={() => {
                            deleteUserFromTeam(user, team).then(() => {
                              _fetchUser(user_id);
                              _fetchUserTeams(user_id);
                            });
                          }}
                        >
                          {(openModal) => (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={openModal}
                            >
                              <MinusCircleIcon />
                            </Button>
                          )}
                        </ConfirmDeleteModal>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
          <Card className="pf-v5-u-mt-lg">
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
                          navigate("/users"),
                        )
                      }
                    >
                      {(openModal) => (
                        <Button variant="danger" size="sm" onClick={openModal}>
                          <TrashAltIcon className="pf-v5-u-mr-sm" />
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
    </MainPage>
  );
}
