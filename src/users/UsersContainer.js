import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "../layout";
import usersActions from "./usersActions";
import rolesActions from "../roles/rolesActions";
import teamsActions from "../teams/teamsActions";
import { CopyButton, EmptyState, ConfirmDeleteButton } from "../ui";
import NewUserButton from "./NewUserButton";
import EditUserButton from "./EditUserButton";
import { getUsers } from "./usersSelectors";
import { getTeams } from "../teams/teamsSelectors";
import { getRoles } from "../roles/rolesSelectors";

export class UsersContainer extends Component {
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
        HeaderButton={<NewUserButton teams={teams} roles={roles} />}
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
              <th className="pf-u-text-align-center col-xs-1">ID</th>
              <th>Login</th>
              <th>Full name</th>
              <th>Email</th>
              <th>Team</th>
              <th>Role</th>
              <th>Created</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={`${user.id}.${user.etag}`}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={user.id} />
                </td>
                <td>{user.name}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.team ? user.team.name.toUpperCase() : null}</td>
                <td>{user.role.name}</td>
                <td>{user.from_now}</td>
                <td className="pf-u-text-align-center">
                  <EditUserButton
                    className="pf-u-mr-xl"
                    user={user}
                    teams={teams}
                    roles={roles}
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
      dispatch(usersActions.all({ embed: "team,role" }));
      dispatch(teamsActions.all());
      dispatch(rolesActions.all());
    },
    deleteUser: user => dispatch(usersActions.delete(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersContainer);
