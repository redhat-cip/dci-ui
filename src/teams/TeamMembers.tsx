import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  CardTitle,
  Skeleton,
} from "@patternfly/react-core";
import { fetchUsersForTeam } from "./teamsApi";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal, CopyButton } from "ui";
import { ITeam, IUser } from "types";
import { Link } from "react-router-dom";
import { addUserToTeam, deleteUserFromTeam } from "users/usersApi";
import AddUserToTeamModal from "./AddUserToTeamModal";
import { sortByName } from "services/sort";
import { showError, showSuccess } from "alerts/alertsSlice";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useAppDispatch } from "store";

export default function TeamMembers({
  team,
  className = "",
}: {
  team: ITeam;
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [teamUsers, setTeamUsers] = useState<IUser[]>([]);

  const _fetchTeamUsers = useCallback((team: ITeam) => {
    fetchUsersForTeam(team)
      .then(setTeamUsers)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    _fetchTeamUsers(team);
  }, [team, _fetchTeamUsers]);

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
                addUserToTeam(user.id, team)
                  .then((response) => {
                    _fetchTeamUsers(team);
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
        ) : (
          <Table
            variant="compact"
            borders={false}
            className="pf-v6-c-tablepf-m-grid-md"
          >
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Login</Th>
                <Th>Full name</Th>
                <Th>Email</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {sortByName(teamUsers).map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <CopyButton text={user.id} />
                  </Td>
                  <Td>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </Td>
                  <Td>{user.fullname}</Td>
                  <Td>{user.email}</Td>
                  <Td className="pf-v6-c-table__action">
                    <ConfirmDeleteModal
                      title={`Delete ${user.name} from ${team.name}`}
                      message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                      onOk={() => {
                        deleteUserFromTeam(user, team).then(() => {
                          _fetchTeamUsers(team);
                        });
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
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
