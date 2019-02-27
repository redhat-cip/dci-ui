import React, { Component } from "react";
import { connect } from "react-redux";
import Formsy from "formsy-react";
import { Toolbar, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import queryString from "query-string";
import { Page } from "layout";
import usersActions from "./usersActions";
import rolesActions from "roles/rolesActions";
import teamsActions from "teams/teamsActions";
import { EmptyState, Pagination } from "ui";
import { Input } from "form";
import NewUserButton from "./NewUserButton";
import { getUsers } from "./usersSelectors";
import { getTeams } from "teams/teamsSelectors";
import { getRoles } from "roles/rolesSelectors";
import UserRow from "./UserRow";

export class UsersContainer extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const { page, perPage } = queryString.parse(location.search);
    this.state = {
      pagination: {
        page: page ? parseInt(page, 10) : 1,
        perPage: perPage ? parseInt(perPage, 10) : 30
      },
      search: ""
    };
  }

  componentDidMount() {
    this._fetchUsersAndChangeUrl();
  }

  _fetchUsersAndChangeUrl = () => {
    const { history, fetchUsers } = this.props;
    const { pagination } = this.state;
    history.push(
      `/users?page=${pagination.page}&perPage=${pagination.perPage}`
    );
    fetchUsers({ pagination });
  };

  _setPageAndFetchUsers = page => {
    this.setState(
      prevState => ({
        pagination: {
          ...prevState.pagination,
          page
        }
      }),
      () => this._fetchUsersAndChangeUrl()
    );
  };

  render() {
    const {
      users,
      count,
      teams,
      roles,
      isFetching,
      currentUser,
      deleteUser
    } = this.props;
    const { search, pagination } = this.state;
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
                    <ToolbarItem>
                      <Formsy
                        onSubmit={({ search }) => this.setState({ search })}
                        className="pf-c-form"
                      >
                        <Input name="search" placeholder="Search a user" />
                      </Formsy>
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <Pagination
                      pagination={pagination}
                      count={count}
                      goTo={page => this._setPageAndFetchUsers(page)}
                      items="users"
                      aria-label="Users pagination"
                    />
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
              <UserRow
                key={`${user.id}.${user.etag}`}
                user={user}
                isDisabled={currentUser.id === user.id}
                deleteConfirmed={() => deleteUser(user)}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={6}>
                <Toolbar className="pf-u-justify-content-space-between pf-u-mv-md">
                  <ToolbarGroup />
                  <ToolbarGroup>
                    <Pagination
                      pagination={pagination}
                      count={count}
                      goTo={page => this._setPageAndFetchUsers(page)}
                      items="users"
                      aria-label="Users pagination"
                    />
                  </ToolbarGroup>
                </Toolbar>
              </th>
            </tr>
          </tfoot>
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: getUsers(state),
    count: state.users.count,
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
    fetchUsers: ({ pagination }) => {
      const params = {
        embed: "team,role",
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage
      };
      dispatch(usersActions.clear());
      dispatch(teamsActions.all());
      dispatch(rolesActions.all());
      return dispatch(usersActions.all(params));
    },
    deleteUser: user => dispatch(usersActions.delete(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersContainer);
