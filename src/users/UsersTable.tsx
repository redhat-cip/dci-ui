import { CopyButton } from "ui";
import { Link } from "react-router-dom";
import { IEnhancedUser } from "types";

interface UsersTableProps {
  users: IEnhancedUser[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <table className="pf-c-table pf-m-compact pf-m-grid-md">
      <thead>
        <tr>
          <th>ID</th>
          <th>Login</th>
          <th>Full name</th>
          <th>Email</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <CopyButton text={user.id} />
            </td>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.fullname}</td>
            <td>{user.email}</td>
            <td>{user.from_now}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
