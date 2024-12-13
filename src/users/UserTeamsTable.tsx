import { Skeleton, Button } from "@patternfly/react-core";
import { MinusCircleIcon } from "@patternfly/react-icons";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link } from "react-router";
import { IUser, ITeam } from "types";
import { ConfirmDeleteModal } from "ui";
import AddUserToTeamForm from "./AddUserToTeamsForm";
import {
  useListUserTeamsQuery,
  useRemoveUserFromTeamMutation,
  useAddUserToTeamMutation,
} from "./usersApi";

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

      <Table borders={false}>
        <Thead>
          <Tr>
            <Th>Team name</Th>
            <Th screenReaderText="Actions" />
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
                <Td isActionCell>
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
                        variant="secondary"
                        isDanger
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
