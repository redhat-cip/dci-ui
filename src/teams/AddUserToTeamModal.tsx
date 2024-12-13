import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalVariant,
  SearchInput,
} from "@patternfly/react-core";
import { ITeam, IUser } from "types";
import useModal from "hooks/useModal";
import { useLazySearchUserQuery } from "users/usersApi";
import { Link } from "react-router";
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
  const [searchUser, { data, isLoading }] = useLazySearchUserQuery();
  const { isOpen, show, hide } = useModal(false);
  const [searchEmail, setSearchEmail] = useState("");
  const onClear = () => setSearchEmail("");
  return (
    <>
      <Modal
        id="add_user_to_team_modal"
        aria-label="Add user to team modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={() => {
          onClear();
          hide();
        }}
      >
        <ModalHeader title={`Add a user to ${team.name} team`} />
        <ModalBody>
          <SearchInput
            placeholder="Find a user by email"
            value={searchEmail}
            onChange={(e, value) => setSearchEmail(value)}
            onSearch={(e, value) => {
              const email = value.endsWith("*") ? value : `${value}*`;
              searchUser(email);
            }}
            onClear={onClear}
          />
          <Table borders={false}>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Login</Th>
                <Th>Full name</Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={4}>...loading</Td>
                </Tr>
              ) : data === undefined ? (
                searchEmail === "" ? (
                  <Tr>
                    <Td colSpan={4}>Search a user by email</Td>
                  </Tr>
                ) : (
                  <Tr>
                    <Td colSpan={4}>No user matching your search</Td>
                  </Tr>
                )
              ) : (
                data.users.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <Link to={`/users/${user.id}`} tabIndex={-1}>
                        {user.email}
                      </Link>
                    </Td>
                    <Td>{user.name}</Td>
                    <Td>{user.fullname}</Td>
                    <Td isActionCell>
                      <Button
                        variant="secondary"
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
                ))
              )}
            </Tbody>
          </Table>
        </ModalBody>
      </Modal>
      {children(show)}
    </>
  );
}
