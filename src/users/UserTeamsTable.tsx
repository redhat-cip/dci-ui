import { Skeleton, Button } from "@patternfly/react-core";
import { MinusCircleIcon } from "@patternfly/react-icons";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link } from "react-router";
import type { IUser } from "types";
import { ConfirmDeleteModal } from "ui";
import AddUserToTeamForm from "./AddUserToTeamsForm";
import {
  useListUserTeamsQuery,
  useRemoveUserFromTeamMutation,
  useAddUserToTeamMutation,
} from "./usersApi";

export function UserTeamsTable({ user }: { user: IUser }) {
  const { data, isFetching } = useListUserTeamsQuery(user ? user : skipToken);
  const [removeUserFromTeam] = useRemoveUserFromTeamMutation();
  const [addUserToTeam] = useAddUserToTeamMutation();

  if (!data) return null;

  return (
    <div>
      <div>
        <AddUserToTeamForm
          onSubmit={({ team_id }) => {
            addUserToTeam({ user_id: user.id, team_id });
          }}
        />
      </div>
      <div className="pf-v6-u-mt-xl">
        <Table variant="compact" borders={false}>
          <Thead>
            <Tr>
              <Th>Team name</Th>
              <Th screenReaderText="Actions" />
            </Tr>
          </Thead>
          <Tbody>
            {isFetching ? (
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
                  <Td noPadding>
                    <Link to={`/teams/${team.id}`}>{team.name}</Link>
                  </Td>
                  <Td noPadding isActionCell>
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
    </div>
  );
}
