import { useState } from "react";
import {
  Button,
  Modal,
  ModalVariant,
  SearchInput,
} from "@patternfly/react-core";
import { ITeam, IUser } from "types";
import useModal from "hooks/useModal";
import { searchUserBy } from "users/usersApi";
import { Link } from "react-router-dom";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

interface AddUserToTeamModalProps {
  team: ITeam;
  onUserSelected: (user: IUser) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function AddUserToTeamModal({
  team,
  onUserSelected,
  children,
}: AddUserToTeamModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [touched, setTouched] = useState(false);

  const onClear = () => {
    setSearchEmail("");
    setTouched(false);
    setUsers([]);
  };
  return (
    <>
      <Modal
        id="add_user_to_team_modal"
        aria-label="Add user to team modal"
        variant={ModalVariant.medium}
        title={`Add a user to ${team.name} team`}
        isOpen={isOpen}
        onClose={() => {
          onClear();
          hide();
        }}
      >
        <SearchInput
          placeholder="Find a user by email"
          value={searchEmail}
          onChange={(e, value) => setSearchEmail(value)}
          onSearch={(e, value) => {
            setTouched(true);
            setIsFetching(true);
            setUsers([]);
            searchUserBy("email", `${value}*`)
              .then((response) => setUsers(response.data.users))
              .finally(() => setIsFetching(false));
          }}
          onClear={onClear}
        />
        {touched && (
          <Table className="pf-v5-c-table pf-m-compact" style={{ border: "0" }}>
            <Thead>
              <Tr>
                <Th>Login</Th>
                <Th>Full name</Th>
                <Th>Email</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <Link to={`/users/${user.id}`} tabIndex={-1}>
                      {user.name}
                    </Link>
                  </Td>
                  <Td>{user.fullname}</Td>
                  <Td>{user.email}</Td>
                  <Td className="pf-v5-c-table__action">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        onClear();
                        hide();
                        onUserSelected(user);
                      }}
                    >
                      Add
                    </Button>
                  </Td>
                </Tr>
              ))}
              {isFetching && users.length === 0 && (
                <Tr>
                  <Td colSpan={4}>...loading</Td>
                </Tr>
              )}
              {!isFetching &&
                users.length === 0 &&
                searchEmail !== "" &&
                touched && (
                  <Tr>
                    <Td colSpan={4}>No user matching your search</Td>
                  </Tr>
                )}
            </Tbody>
          </Table>
        )}
      </Modal>
      {children(show)}
    </>
  );
}
