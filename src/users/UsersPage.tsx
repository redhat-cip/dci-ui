import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  ToolbarGroup,
  ToolbarContent,
  Pagination,
  ToolbarItem,
  Toolbar,
  PageSectionVariants,
  Bullseye,
  PageSection,
} from "@patternfly/react-core";
import { PlusCircleIcon, SearchIcon } from "@patternfly/react-icons";
import { Page, LoadingPage } from "layout";
import usersActions from "./usersActions";
import { CopyButton, EmptyState, Breadcrumb } from "ui";
import { getUsers, getNbOfUsers, isFetchingUsers } from "./usersSelectors";
import { getParamsFromFilters } from "jobs/toolbar/filters";
import EmailsFilter from "./EmailsFilter";
import { useHistory, Link } from "react-router-dom";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { IUserFilters } from "types";
import { AppDispatch } from "store";
import CreateUserModal from "./create/CreateUserModal";

const initialUserFilter = {
  page: 1,
  perPage: 20,
  email: null,
  sort: "-created_at",
};

export default function UsersPage() {
  const currentUser = useSelector(getCurrentUser);
  const users = useSelector(getUsers);
  const numOfUsers = useSelector(getNbOfUsers);
  const isFetching = useSelector(isFetchingUsers);
  const [filters, setFilters] = useState<IUserFilters>({
    ...initialUserFilter,
  });
  const dispatch = useDispatch<AppDispatch>();

  const search = (s: IUserFilters) => {
    setFilters(s);
  };

  useEffect(() => {
    const params = getParamsFromFilters(filters);
    dispatch(usersActions.clear());
    dispatch(usersActions.all(params));
  }, [dispatch, filters]);

  if (currentUser === null) return null;

  const breadcrumb = (
    <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Users" }]} />
  );

  if (isFetching) return <LoadingPage title="Users" breadcrumb={breadcrumb} />;

  return (
    <Page
      title="Users"
      description="List of DCI users"
      Toolbar={
        <Toolbar id="toolbar-users" collapseListedFiltersBreakpoint="xl">
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <EmailsFilter
                  search={filters.email || ""}
                  onSearch={(email) => {
                    search({ ...initialUserFilter, email });
                  }}
                />
              </ToolbarItem>
              <ToolbarItem variant="separator" />
              <ToolbarItem>
                {currentUser.isSuperAdmin ? (
                  <CreateUserModal
                    onSubmit={(user) => {
                      dispatch(usersActions.create(user)).then(() =>
                        search({ ...initialUserFilter })
                      );
                    }}
                  >
                    {(openModal) => (
                      <Button variant="primary" onClick={openModal}>
                        <PlusCircleIcon className="mr-xs" />
                        Create a new user
                      </Button>
                    )}
                  </CreateUserModal>
                ) : null}
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
      breadcrumb={breadcrumb}
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
      )}
    </Page>
  );
}
