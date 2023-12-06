import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  TextContent,
  Text,
  CardTitle,
  Skeleton,
} from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import UserForm from "./UserForm";
import AddUserToTeamForm from "./AddUserToTeamsForm";
import { TrashAltIcon, MinusCircleIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal, Breadcrumb } from "ui";
import { ITeam, IUser } from "types";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { global_danger_color_100 } from "@patternfly/react-tokens";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import {
  useAddUserToTeamMutation,
  useRemoveUserFromTeamMutation,
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useListUserTeamsQuery,
} from "./usersApi";
import { skipToken } from "@reduxjs/toolkit/query";

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

export function UserTeamsTable({ user }: { user: IUser }) {
  const { data, isLoading, isFetching } = useListUserTeamsQuery(
    user ? user : skipToken,
  );
  const [removeUserFromTeam, { isLoading: isRemoving }] =
    useRemoveUserFromTeamMutation();
  const [addUserToTeam, { isLoading: isLoadingAddUserToTeam }] =
    useAddUserToTeamMutation();

  if (!data) return null;
  return (
    <div>
      <AddUserToTeamForm
        isDisabled={isLoadingAddUserToTeam}
        onSubmit={(team: ITeam) => {
          addUserToTeam({ user, team });
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
          {isLoading ? (
            <Tr>
              <Td colSpan={2}>
                <Skeleton screenreaderText="Loading user's teams" />
              </Td>
            </Tr>
          ) : data.teams.length === 0 ? (
            <Tr>
              <Td colSpan={2}>{`User ${user.name} has no team`}</Td>
            </Tr>
          ) : (
            data.teams.map((team) => (
              <Tr key={team.id}>
                <Td>
                  <Link to={`/teams/${team.id}`}>{team.name}</Link>
                </Td>
                <Td className="pf-v5-c-table__action">
                  <ConfirmDeleteModal
                    title={`Delete ${user.name} from ${team.name}`}
                    message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                    onOk={() => {
                      removeUserFromTeam({ user, team });
                    }}
                  >
                    {(openModal) => (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={openModal}
                        isDisabled={isRemoving || isFetching}
                      >
                        <MinusCircleIcon />
                      </Button>
                    )}
                  </ConfirmDeleteModal>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  );
}

export default function UserPage() {
  const navigate = useNavigate();
  const { user_id } = useParams();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const { data: user, isLoading } = useGetUserQuery(
    user_id ? user_id : skipToken,
  );

  if (!user_id || !user) return null;

  return (
    <MainPage
      title={`Edit user ${user.fullname}`}
      loading={isLoading}
      description={user ? `Details page for user ${user.name}` : "Details page"}
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/users", title: "Users" },
            { to: `/users/${user_id}`, title: user_id },
          ]}
        />
      }
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <UserForm id="user-edit-form" user={user} onSubmit={updateUser} />
              <Button
                variant="primary"
                type="submit"
                form="user-edit-form"
                isDisabled={isUpdating}
              >
                Edit
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <Card>
            <CardTitle>User teams</CardTitle>
            <CardBody>
              <UserTeamsTable user={user} />
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
                        deleteUser(user).then(() => navigate("/users"))
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
