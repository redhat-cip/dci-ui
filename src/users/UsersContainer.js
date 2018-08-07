import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import DCICard from "../DCICard";
import usersActions from "./usersActions";
import rolesActions from "../roles/rolesActions";
import teamsActions from "../teams/teamsActions";
import {CopyButton, EmptyState} from "../ui";
import NewUserButton from "./NewUserButton";
import EditUserButton from "./EditUserButton";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getUsers } from "./usersSelectors";
import { getTeams } from "../teams/teamsSelectors";
import { getRoles } from "../roles/rolesSelectors";
import { MainContent } from "../layout";

export class UsersContainer extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }
  render() {
    const { users, teams, roles, isFetching } = this.props;
    return (
      <MainContent>
        <DCICard
          title="Users"
          loading={isFetching && _.isEmpty(users)}
          empty={!isFetching && _.isEmpty(users)}
          HeaderButton={
            <NewUserButton teams={teams} roles={roles} className="pull-right" />
          }
          EmptyComponent={
            <EmptyState
              title="There is no users"
              info="Do you want to create one?"
              button={<NewUserButton teams={teams} roles={roles} />}
            />
          }
        >
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center col-xs-1">ID</th>
                <th>Login</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Role</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={user.id} />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.team ? user.team.name.toUpperCase() : null}</td>
                  <td>{user.role.name}</td>
                  <td>{user.from_now}</td>
                  <td className="text-center">
                    <EditUserButton
                      key={user.etag}
                      user={user}
                      teams={teams}
                      roles={roles}
                    />
                    <ConfirmDeleteButton
                      name="user"
                      resource={user}
                      whenConfirmed={user => this.props.deleteUser(user)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DCICard>
      </MainContent>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: getUsers(state),
    teams: getTeams(state),
    roles: getRoles(state),
    isFetching:
      state.teams.isFetching || state.users.isFetching || state.roles.isFetching
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
