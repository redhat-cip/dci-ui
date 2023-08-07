import { CopyButton } from "ui";
import { Link } from "react-router-dom";
import { IEnhancedUser } from "types";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

interface UsersTableProps {
  users: IEnhancedUser[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <Table aria-label="Users table" variant="compact">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Login</Th>
          <Th>Full name</Th>
          <Th>Email</Th>
          <Th>Red Hat login</Th>
          <Th>Created</Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((user) => (
          <Tr key={user.id}>
            <Td dataLabel="ID">
              <CopyButton text={user.id} />
            </Td>
            <Td dataLabel="Login">
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </Td>
            <Td dataLabel="Full name">{user.fullname}</Td>
            <Td dataLabel="Email">{user.email}</Td>
            <Td dataLabel="Red Hat login">{user.sso_username}</Td>
            <Td dataLabel="Created">{user.from_now}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
