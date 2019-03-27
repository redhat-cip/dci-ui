import React, { Component } from "react";
import { connect } from "react-redux";
import { Toolbar, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { Page } from "layout";
import usersActions from "./usersActions";
import rolesActions from "roles/rolesActions";
import teamsActions from "teams/teamsActions";
import { EmptyState } from "ui";
import NewUserButton from "./NewUserButton";
import { getUsers } from "./usersSelectors";
import { getTeams } from "teams/teamsSelectors";
import { getRoles } from "roles/rolesSelectors";
import UserRow from "./UserRow";

export class UsersPage extends Component {
  componentDidMount() {
    const { fetchUsers } = this.props;
    fetchUsers();
  }

  render() {
    const {
      users,
      teams,
      roles,
      isFetching,
      currentUser,
      deleteUser
    } = this.props;
    return (
      <Page
        title="Users"
        loading={isFetching && isEmpty(users)}
        empty={!isFetching && isEmpty(users)}
        EmptyComponent={
          <EmptyState
            title="There is no users"
            info="Do you want to create one?"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th colSpan={6}>
                <Toolbar className="pf-u-justify-content-space-between pf-u-mv-md">
                  <ToolbarGroup>
                    <ToolbarItem className="pf-u-mr-md">
                      <NewUserButton teams={teams} roles={roles} />
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
            {users.map(user => (
              <UserRow
                key={`${user.id}.${user.etag}`}
                user={user}
                teams={teams}
                roles={roles}
                isDisabled={currentUser.id === user.id}
                deleteConfirmed={() => deleteUser(user)}
              />
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
    teams: getTeams(state),
    roles: getRoles(state),
    isFetching:
      state.teams.isFetching ||
      state.users.isFetching ||
      state.roles.isFetching,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => {
      dispatch(usersActions.clear());
      dispatch(teamsActions.all());
      dispatch(rolesActions.all());
      return dispatch(usersActions.all());
    },
    deleteUser: user => dispatch(usersActions.delete(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersPage);
