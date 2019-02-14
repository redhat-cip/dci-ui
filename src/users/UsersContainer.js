import React, { Component } from "react";
import { connect } from "react-redux";
import Formsy from "formsy-react";
import { Toolbar, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { Page } from "../layout";
import usersActions from "./usersActions";
import { CopyButton, EmptyState, ConfirmDeleteButton } from "../ui";
import { Input } from "../form";
import NewUserButton from "./NewUserButton";
import EditUserButton from "./EditUserButton";
import { getUsers } from "./usersSelectors";

export class UsersContainer extends Component {
  state = {
    search: ""
  };
  componentDidMount() {
    const { fetchUsers } = this.props;
    fetchUsers();
  }
  render() {
    const { users, isFetching, currentUser, deleteUser } = this.props;
    const { search } = this.state;
    const filteredUsers = users.filter(user => {
      const lowerSearch = search.toLowerCase();
      return (
        user.email.toLowerCase().includes(lowerSearch) ||
        user.name.toLowerCase().includes(lowerSearch) ||
        user.fullname.toLowerCase().includes(lowerSearch)
      );
    });
    return (
      <Page
        title="Users"
        loading={isFetching && isEmpty(filteredUsers)}
        empty={!isFetching && isEmpty(filteredUsers)}
        EmptyComponent={
          <EmptyState
            title="There is no users"
            info={
              isEmpty(search)
                ? "Do you want to create one?"
                : "Modify your search"
            }
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th colSpan={6}>
                <Toolbar className="pf-u-m-md">
                  <ToolbarGroup>
                    <ToolbarItem>
                      <NewUserButton />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <Formsy
                        onChange={({ search }) => this.setState({ search })}
                        className="pf-c-form"
                      >
                        <Input name="search" placeholder="Search a user" />
                      </Formsy>
                    </ToolbarItem>
                  </ToolbarGroup>
                </Toolbar>
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>ID</th>
              <th>Login</th>
              <th>Full name</th>
              <th>Email</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={`${user.id}.${user.etag}`}>
                <td>
                  <CopyButton text={user.id} />
                </td>
                <td>{user.name}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.from_now}</td>
                <td className="pf-u-text-align-right">
                  <EditUserButton
                    className="pf-u-mr-xs"
                    user={user}
                    isDisabled={currentUser.id === user.id}
                  />
                  <ConfirmDeleteButton
                    title={`Delete user ${user.name}`}
                    content={`Are you sure you want to delete ${user.name}?`}
                    whenConfirmed={() => deleteUser(user)}
                    isDisabled={currentUser.id === user.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: getUsers(state),
    isFetching: state.users.isFetching,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => dispatch(usersActions.all()),
    deleteUser: user => dispatch(usersActions.delete(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersContainer);
