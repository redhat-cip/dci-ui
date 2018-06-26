// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React from "react";
import { connect } from "../store";
import PropTypes from "prop-types";
import _ from "lodash";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import usersActions from "../Components/Users/actions";
import rolesActions from "../Components/Roles/actions";
import teamsActions from "../Components/Teams/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import NewUserButton from "../Components/Users/NewUserButton";
import EditUserButton from "../Components/Users/EditUserButton";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import { getUsers } from "../Components/Users/selectors";

export class UsersScreen extends React.Component {
  componentDidMount() {
    this.props.fetchUsers();
  }
  render() {
    const { users, isFetching } = this.props;
    return (
      <MainContent>
        <TableCard
          title="Users"
          loading={isFetching && _.isEmpty(users)}
          empty={!isFetching && _.isEmpty(users)}
          HeaderButton={<NewUserButton className="pull-right" />}
          EmptyComponent={
            <EmptyState
              title="There is no users"
              info="Do you want to create one?"
              button={<NewUserButton />}
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
                  <td>{user.team.name.toUpperCase()}</td>
                  <td>{user.role.name}</td>
                  <td>{user.from_now}</td>
                  <td className="text-center">
                    <EditUserButton user={user} />
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
        </TableCard>
      </MainContent>
    );
  }
}

UsersScreen.propTypes = {
  users: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchUsers: PropTypes.func,
  deleteUser: PropTypes.func
};

function mapStateToProps(state) {
  return {
    users: getUsers(state),
    isFetching:
      state.teams2.isFetching ||
      state.users2.isFetching ||
      state.roles2.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => {
      dispatch(usersActions.all({ embed: "team,role" }));
      dispatch(rolesActions.all());
      dispatch(teamsActions.all());
    },
    deleteUser: user => dispatch(actions.delete(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersScreen);
