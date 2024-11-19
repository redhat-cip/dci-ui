import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  Content,
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
import { t_global_color_nonstatus_red_200 } from "@patternfly/react-tokens";
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
  border: 1px solid ${t_global_color_nonstatus_red_200.value};
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

      <Table variant="compact" className="pf-v6-c-tablepf-m-grid-md">
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
                <Td className="pf-v6-c-table__action">
                  <ConfirmDeleteModal
                    title={`Delete ${user.name} from ${team.name}`}
                    message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                    onOk={() => {
                      removeUserFromTeam({ user, team });
                    }}
                  >
                    {(openModal) => (
                      <Button
                        icon={<MinusCircleIcon />}
                        variant="danger"
                        size="sm"
                        onClick={openModal}
                        isDisabled={isRemoving || isFetching}
                      ></Button>
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
          <Card className="pf-v6-u-mt-lg">
            <CardTitle>Danger Zone</CardTitle>
            <CardBody>
              <DangerZone>
                <DangerZoneRow>
                  <div>
                    <Content>
                      <Content component="h2">{`Delete ${user.name} user`}</Content>
                      <Content component="p">
                        Once you delete a user, there is no going back. Please
                        be certain.
                      </Content>
                    </Content>
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
                        <Button
                          icon={<TrashAltIcon className="pf-v6-u-mr-sm" />}
                          variant="danger"
                          size="sm"
                          onClick={openModal}
                        >
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
