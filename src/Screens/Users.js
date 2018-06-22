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
import * as date from "../Components/Date";
import { MainContent } from "../Components/Layout";
import TableCard from "../Components/TableCard";
import actions from "../Components/Users/actions";
import CopyButton from "../Components/CopyButton";
import EmptyState from "../Components/EmptyState";
import ConfirmDeleteButton from "../Components/ConfirmDeleteButton";
import _ from "lodash";

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
          loading={isFetching && !users.length}
          empty={!isFetching && !users.length}
          HeaderButton={
            <a
              id="users__create-user-btn"
              className="pull-right btn btn-primary"
              href="/users/create"
            >
              Create a new user
            </a>
          }
          EmptyComponent={
            <EmptyState
              title="There is no users"
              info="Do you want to create one?"
              button={
                <a className="btn btn-primary" href="/users/create">
                  Create a new user
                </a>
              }
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
              {_.sortBy(users, [e => e.name.toLowerCase()]).map((user, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={user.id} />
                  </td>
                  <td>
                    <a href={`/users/${user.id}`}>{user.name}</a>
                  </td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.team.name.toUpperCase()}</td>
                  <td>{user.role.name}</td>
                  <td>{user.from_now}</td>
                  <td className="text-center">
                    <a
                      className="btn btn-primary btn-sm btn-edit"
                      href={`/users/${user.id}`}
                    >
                      <i className="fa fa-pencil" />
                    </a>

                    <ConfirmDeleteButton
                      title={`Delete user ${user.name}`}
                      body={`Are you you want to delete ${user.name}?`}
                      okButton={`Yes delete ${user.name}`}
                      cancelButton="oups no!"
                      whenConfirmed={() => this.props.deleteUser(user)}
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
    users: date.transformObjectsDates(
      state.users2.byId,
      state.currentUser.timezone
    ),
    isFetching: state.users2.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => dispatch(actions.all({ embed: "team,role" })),
    deleteUser: user => dispatch(actions.delete(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersScreen);
