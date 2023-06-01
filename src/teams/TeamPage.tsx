import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  TextContent,
  Text,
  CardTitle,
  Divider,
  Label,
} from "@patternfly/react-core";
import teamsActions, { fetchUsersForTeam } from "./teamsActions";
import {
  TrashAltIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  EditAltIcon,
} from "@patternfly/react-icons";
import { ConfirmDeleteModal, Breadcrumb, CopyButton } from "ui";
import { AppDispatch } from "store";
import { ITeam, IUser } from "types";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { global_danger_color_100 } from "@patternfly/react-tokens";
import { addUserToTeam, deleteUserFromTeam } from "users/usersActions";
import AddUserToTeamModal from "./AddUserToTeamModal";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import EditTeamModal from "./EditTeamModal";
import CardLine from "ui/CardLine";
import { sortByName } from "services/sort";
import { showError, showSuccess } from "alerts/alertsActions";
import MainPage from "pages/MainPage";
import LoadingPage from "pages/LoadingPage";

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

export default function TeamPage() {
  const currentUser = useSelector(getCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [team, setTeam] = useState<ITeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamUsers, setTeamUsers] = useState<IUser[]>([]);
  const { team_id } = useParams();

  const _fetchTeam = useCallback(
    (id: string) => {
      dispatch(teamsActions.one(id)).then((response) => {
        setTeam(response.data.team);
      });
    },
    [dispatch, setTeam]
  );

  const _fetchTeamUsers = useCallback((id: string) => {
    fetchUsersForTeam({ id } as ITeam)
      .then((response) => {
        setTeamUsers(response.data.users);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (team_id) {
      _fetchTeam(team_id);
      _fetchTeamUsers(team_id);
    }
  }, [team_id, _fetchTeam, _fetchTeamUsers]);

  if (!team_id) return null;

  const breadcrumb = (
    <Breadcrumb
      links={[
        { to: "/", title: "DCI" },
        { to: "/teams", title: "Teams" },
        { to: `/teams/${team_id}`, title: team_id },
      ]}
    />
  );

  if (team === null) {
    return <LoadingPage title="Team" description="Details page" />;
  }

  return (
    <MainPage
      title={`Team ${team.name}`}
      description={team ? `Details page for team ${team.name}` : "Details page"}
      Breadcrumb={breadcrumb}
      HeaderButton={
        currentUser?.isSuperAdmin && team ? (
          <EditTeamModal
            team={team}
            onSubmit={(team) => dispatch(teamsActions.update(team))}
          >
            {(openModal) => (
              <Button type="button" onClick={openModal}>
                <EditAltIcon className="mr-xs" />
                {`edit ${team.name} team`}
              </Button>
            )}
          </EditTeamModal>
        ) : null
      }
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardTitle>Team information</CardTitle>
            <CardBody>
              <CardLine className="p-md" field="ID" value={team.id} />
              <Divider />
              <CardLine className="p-md" field="Name" value={team.name} />
              <Divider />
              <CardLine
                className="p-md"
                field="Members"
                value={isLoading ? "" : teamUsers.length}
              />
              <Divider />
              <CardLine className="p-md" field="State" value={team.state} />
              <CardLine
                className="p-md"
                field="Partner"
                value={team.external ? <Label color="blue">yes</Label> : null}
              />
            </CardBody>
          </Card>
          <Card className="mt-lg">
            <CardTitle>Danger Zone</CardTitle>
            <CardBody>
              <DangerZone>
                <DangerZoneRow>
                  <div>
                    <TextContent>
                      <Text component="h2">{`Delete ${team.name} team`}</Text>
                      <Text component="p">
                        Once you delete a team, there is no going back. Please
                        be certain.
                      </Text>
                    </TextContent>
                  </div>
                  <div>
                    <ConfirmDeleteModal
                      title={`Delete team ${team.name}`}
                      message={`Are you sure you want to delete ${team.name} team?`}
                      onOk={() =>
                        dispatch(teamsActions.delete(team)).then(() =>
                          navigate("/teams")
                        )
                      }
                    >
                      {(openModal) => (
                        <Button variant="danger" isSmall onClick={openModal}>
                          <TrashAltIcon className="mr-sm" />
                          Delete this team
                        </Button>
                      )}
                    </ConfirmDeleteModal>
                  </div>
                </DangerZoneRow>
              </DangerZone>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <Card>
            <CardTitle>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>Team members</div>
                <div>
                  <AddUserToTeamModal
                    team={team}
                    onUserSelected={(user) => {
                      const fullname = user.fullname;
                      addUserToTeam(user.id, team)
                        .then((response) => {
                          _fetchTeamUsers(team.id);
                          dispatch(
                            showSuccess(
                              `${fullname} added successfully to ${team.name} team.`
                            )
                          );
                          return response;
                        })
                        .catch((error) => {
                          dispatch(
                            showError(
                              `We can't add ${fullname} user to ${team.name} team`
                            )
                          );
                          return error;
                        });
                    }}
                  >
                    {(openModal) => (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={openModal}
                      >
                        <PlusCircleIcon className="mr-xs" />
                        Add a user
                      </Button>
                    )}
                  </AddUserToTeamModal>
                </div>
              </div>
            </CardTitle>
            <CardBody>
              <table className="pf-c-table pf-m-compact pf-m-grid-md">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Login</th>
                    <th>Full name</th>
                    <th>Email</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {sortByName(teamUsers).map((user) => (
                    <tr key={user.id}>
                      <td>
                        <CopyButton text={user.id} />
                      </td>
                      <td>
                        <Link to={`/users/${user.id}`}>{user.name}</Link>
                      </td>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td className="pf-c-table__action">
                        <ConfirmDeleteModal
                          title={`Delete ${user.name} from ${team.name}`}
                          message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                          onOk={() => {
                            deleteUserFromTeam(user, team).then(() => {
                              _fetchTeamUsers(team_id);
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
        </GridItem>
      </Grid>
    </MainPage>
  );
}
