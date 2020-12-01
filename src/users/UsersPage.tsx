import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  DropdownItem,
  DropdownPosition,
  ToolbarGroup,
  ToolbarContent,
  Pagination,
  ToolbarItem,
  Toolbar,
  PageSectionVariants,
  Bullseye,
  PageSection,
} from "@patternfly/react-core";
import {
  WarningTriangleIcon,
  EditAltIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@patternfly/react-icons";
import { global_danger_color_100 } from "@patternfly/react-tokens";
import { Page, LoadingPage } from "layout";
import usersActions from "./usersActions";
import { CopyButton, EmptyState, KebabDropdown, TextRed } from "ui";
import { getUsers, getNbOfUsers, isFetchingUsers } from "./usersSelectors";
import { getParamsFromFilters } from "jobs/toolbar/filters";
import EmailsFilter from "./EmailsFilter";
import { useHistory } from "react-router-dom";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { IUser, IUserFilters } from "types";
import { AppDispatch } from "store";

const initialUserFilter = {
  page: 1,
  perPage: 20,
  email: null,
};

export default function UsersPage() {
  const currentUser = useSelector(getCurrentUser);
  const users = useSelector(getUsers);
  const numOfUsers = useSelector(getNbOfUsers);
  const isFetching = useSelector(isFetchingUsers);
  const history = useHistory();
  const [filters, setFilters] = useState<IUserFilters>({
    ...initialUserFilter,
  });
  const dispatch = useDispatch<AppDispatch>();

  const clear = () => {
    const s = { ...initialUserFilter };
    setFilters(s);
  };

  const search = (s: IUserFilters) => {
    setFilters(s);
  };

  useEffect(() => {
    const params = getParamsFromFilters(filters);
    dispatch(usersActions.clear());
    dispatch(usersActions.all(params));
  }, [dispatch, filters]);

  if (currentUser === null) return null;

  if (isFetching) return <LoadingPage title="Users" />;

  const getDropdownItems = (user: IUser) => {
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
          onClick={() => dispatch(usersActions.delete(user))}
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

  return (
    <Page
      title="Users"
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
                  search={filters.email || ""}
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
                    perPage={filters.perPage}
                    page={filters.page}
                    itemCount={numOfUsers}
                    onSetPage={(e, newPage) => {
                      search({
                        ...filters,
                        page: newPage,
                      });
                    }}
                    onPerPageSelect={(e, newPerPage) => {
                      search({
                        ...filters,
                        perPage: newPerPage,
                      });
                    }}
                  />
                )}
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      }
    >
      {users.length === 0 ? (
        <PageSection variant={PageSectionVariants.light}>
          <Bullseye>
            <EmptyState
              title="No user matches this search"
              info={`There are no users with the ${filters.email} email. Change your search and start over.`}
              icon={SearchIcon}
            />
          </Bullseye>
        </PageSection>
      ) : (
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
                    items={getDropdownItems(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Page>
  );
}
