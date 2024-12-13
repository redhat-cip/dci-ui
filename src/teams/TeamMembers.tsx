import {
  Card,
  CardBody,
  Button,
  CardTitle,
  Skeleton,
} from "@patternfly/react-core";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal, CopyButton } from "ui";
import { ITeam } from "types";
import { Link } from "react-router";
import {
  useAddUserToTeamMutation,
  useListTeamsUserQuery,
  useRemoveUserFromTeamMutation,
} from "users/usersApi";
import AddUserToTeamModal from "./AddUserToTeamModal";
import { sortByName } from "services/sort";
import { showError, showSuccess } from "alerts/alertsSlice";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useAppDispatch } from "store";
import { skipToken } from "@reduxjs/toolkit/query";

export default function TeamMembers({
  team,
  className = "",
}: {
  team: ITeam;
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useListTeamsUserQuery(team ? team : skipToken);
  const [removeUserFromTeam] = useRemoveUserFromTeamMutation();
  const [addUserToTeam] = useAddUserToTeamMutation();
  return (
    <Card className={className}>
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
                addUserToTeam({ user, team })
                  .then((response) => {
                    dispatch(
                      showSuccess(
                        `${fullname} added successfully to ${team.name} team.`,
                      ),
                    );
                    return response;
                  })
                  .catch((error) => {
                    dispatch(
                      showError(
                        `We can't add ${fullname} user to ${team.name} team`,
                      ),
                    );
                    return error;
                  });
              }}
            >
              {(openModal) => (
                <Button
                  icon={<PlusCircleIcon className="pf-v6-u-mr-xs" />}
                  type="button"
                  variant="secondary"
                  onClick={openModal}
                >
                  Add a user
                </Button>
              )}
            </AddUserToTeamModal>
          </div>
        </div>
      </CardTitle>
      <CardBody>
        {isLoading ? (
          <Skeleton screenreaderText="Loading team's users" />
        ) : data === undefined ? null : (
          <Table borders={false}>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Login</Th>
                <Th>Full name</Th>
                <Th>Email</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {sortByName(data.users).map((user) => (
                <Tr key={user.id}>
                  <Td isActionCell>
                    <CopyButton text={user.id} />
                  </Td>
                  <Td>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </Td>
                  <Td>{user.fullname}</Td>
                  <Td>{user.email}</Td>
                  <Td isActionCell>
                    <ConfirmDeleteModal
                      title={`Delete ${user.name} from ${team.name}`}
                      message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                      onOk={() => removeUserFromTeam({ user, team })}
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
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
