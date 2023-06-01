import { useState } from "react";
import {
  Button,
  Modal,
  ModalVariant,
  SearchInput,
} from "@patternfly/react-core";
import { ITeam, IUser } from "types";
import useModal from "hooks/useModal";
import { searchUserBy } from "users/usersActions";
import { Link } from "react-router-dom";

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
          onSearch={(value) => {
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
          <table className="pf-c-table pf-m-compact" style={{ border: "0" }}>
            <thead>
              <tr>
                <th>Login</th>
                <th>Full name</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`} tabIndex={-1}>
                      {user.name}
                    </Link>
                  </td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td className="pf-c-table__action">
                    <Button
                      isSmall
                      variant="primary"
                      onClick={() => {
                        onClear();
                        hide();
                        onUserSelected(user);
                      }}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
              {isFetching && users.length === 0 && (
                <tr>
                  <td colSpan={4}>...loading</td>
                </tr>
              )}
              {!isFetching &&
                users.length === 0 &&
                searchEmail !== "" &&
                touched && (
                  <tr>
                    <td colSpan={4}>No user matching your search</td>
                  </tr>
                )}
            </tbody>
          </table>
        )}
      </Modal>
      {children(show)}
    </>
  );
}
