import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  DropdownItem,
  DropdownPosition,
  ToolbarGroup,
  ToolbarContent,
  Pagination,
  ToolbarItem,
  Toolbar,
} from "@patternfly/react-core";
import {
  WarningTriangleIcon,
  EditAltIcon,
  PlusCircleIcon,
} from "@patternfly/react-icons";
import { global_danger_color_100 } from "@patternfly/react-tokens";
import { isEmpty } from "lodash";
import { Page } from "layout";
import usersActions from "./usersActions";
import { CopyButton, EmptyState, KebabDropdown, TextRed } from "ui";
import { getUsers, getNbOfUsers } from "./usersSelectors";
import { getParamsFromFilters } from "jobs/toolbar/filters";
import EmailsFilter from "./EmailsFilter";

const initialUserFilter = {
  page: 1,
  perPage: 20,
  email: null,
};

export class UsersPage extends Component {
  state = {
    ...initialUserFilter,
  };

  componentDidMount() {
    const { fetchUsers } = this.props;
    const { page, perPage, email } = this.state;
    fetchUsers({ perPage, page, email });
  }

  getDropdownItems = (user) => {
    const { currentUser, deleteUser, history } = this.props;
    const dropdownItems = [
      <DropdownItem
        component="button"
        onClick={() => history.push(`/users/${user.id}`)}
        key="edit user"
      >
        <EditAltIcon className="mr-xs" /> Edit a user
      </DropdownItem>,
    ];
    if (currentUser.isSuperAdmin) {
      dropdownItems.push(
        <DropdownItem
          component="button"
          onClick={() => deleteUser(user)}
          key="delete user"
        >
          <WarningTriangleIcon
            color={global_danger_color_100.value}
            className="mr-xs"
          />
          <TextRed>delete a user</TextRed>
        </DropdownItem>
      );
    }
    return dropdownItems;
  };

  render() {
    const {
      currentUser,
      users,
      numOfUsers,
      isFetching,
      history,
      fetchUsers,
    } = this.props;
    const { email, page, perPage } = this.state;

    const clear = () => {
      const s = { ...initialUserFilter };
      this.setState(s);
      fetchUsers(s);
    };

    const search = (s) => {
      this.setState(s);
      fetchUsers(s);
    };

    return (
      <Page
        title="Users"
        loading={isFetching && isEmpty(users)}
        empty={!isFetching && isEmpty(users)}
        HeaderButton={
          currentUser.isSuperAdmin ? (
            <Button
              variant="primary"
              onClick={() => history.push("/users/create")}
            >
              <PlusCircleIcon className="mr-xs" />
              Create a new user
            </Button>
          ) : null
        }
        Toolbar={
          <Toolbar
            id="toolbar-users"
            clearAllFilters={clear}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>
                  <EmailsFilter
                    search={email}
                    onClear={clear}
                    onSearch={(email) => {
                      search({ ...initialUserFilter, email });
                    }}
                  />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup style={{ flex: "1" }}>
                <ToolbarItem
                  variant="pagination"
                  alignment={{ default: "alignRight" }}
                >
                  {numOfUsers === 0 ? null : (
                    <Pagination
                      perPage={perPage}
                      page={page}
                      itemCount={numOfUsers}
                      onSetPage={(e, newPage) => {
                        search({
                          ...initialUserFilter,
                          perPage,
                          page: newPage,
                        });
                      }}
                      onPerPageSelect={(e, newPerPage) => {
                        search({
                          ...initialUserFilter,
                          perPage: newPerPage,
                          page,
                        });
                      }}
                    />
                  )}
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        }
        EmptyComponent={
          <EmptyState
            title="There is no users"
            info="There is no user available for this search. Update your search and start over. Thank you"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <CopyButton text={user.id} />
                </td>
                <td>{user.name}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.from_now}</td>
                <td className="pf-c-table__action">
                  <KebabDropdown
                    position={DropdownPosition.right}
                    items={this.getDropdownItems(user)}
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
    numOfUsers: getNbOfUsers(state),
    users: getUsers(state),
    isFetching: state.users.isFetching,
    currentUser: state.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: ({ perPage, page, email }) => {
      dispatch(usersActions.clear());
      const params = getParamsFromFilters({ perPage, page });
      if (email) {
        params.where = `email:${email}`;
      }
      return dispatch(usersActions.all(params));
    },
    deleteUser: (user) => dispatch(usersActions.delete(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
