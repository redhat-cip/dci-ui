import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  ToolbarGroup,
  ToolbarContent,
  Pagination,
  ToolbarItem,
  Toolbar,
} from "@patternfly/react-core";
import { PlusCircleIcon, SearchIcon } from "@patternfly/react-icons";
import usersActions from "./usersActions";
import { EmptyState, Breadcrumb } from "ui";
import { getUsers, getNbOfUsers, isFetchingUsers } from "./usersSelectors";
import { getParamsFromFilters } from "jobs/toolbar/filters";
import EmailsFilter from "./EmailsFilter";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import { IUserFilters } from "types";
import { AppDispatch } from "store";
import CreateUserModal from "./create/CreateUserModal";
import UsersTable from "./UsersTable";
import MainPage from "pages/MainPage";
import { isEmpty } from "lodash";

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

  useEffect(() => {
    const params = getParamsFromFilters(filters);
    dispatch(usersActions.clear());
    dispatch(usersActions.all(params));
  }, [dispatch, filters]);

  if (currentUser === null) return null;

  return (
    <MainPage
      title="Users"
      description="List of DCI users"
      loading={isFetching && isEmpty(users)}
      HeaderButton={
        currentUser.isSuperAdmin ? (
          <CreateUserModal
            onSubmit={(user) => {
              dispatch(usersActions.create(user)).then(() =>
                setFilters({ ...initialUserFilter }),
              );
            }}
          >
            {(openModal) => (
              <Button variant="primary" onClick={openModal}>
                <PlusCircleIcon className="pf-v5-u-mr-xs" />
                Create a new user
              </Button>
            )}
          </CreateUserModal>
        ) : null
      }
      EmptyComponent={
        <EmptyState title="No users" info="There is no users at the moment." />
      }
      Breadcrumb={
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Users" }]} />
      }
    >
      <Toolbar id="toolbar-users" collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <EmailsFilter
                search={filters.email || ""}
                onSearch={(email) => {
                  setFilters({ ...initialUserFilter, email });
                }}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup style={{ flex: "1" }}>
            <ToolbarItem variant="pagination" align={{ default: "alignRight" }}>
              {numOfUsers === 0 ? null : (
                <Pagination
                  perPage={filters.perPage}
                  page={filters.page}
                  itemCount={numOfUsers}
                  onSetPage={(e, newPage) => {
                    setFilters({ ...filters, page: newPage });
                  }}
                  onPerPageSelect={(e, newPerPage) => {
                    setFilters({ ...filters, perPage: newPerPage });
                  }}
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      {!isFetching && users.length === 0 ? (
        filters.email === "" ? (
          <EmptyState
            title="There is no users"
            info="Do you want to create one?"
          />
        ) : (
          <EmptyState
            icon={SearchIcon}
            title="There is no users"
            info={`We found 0 results for ${filters.email} search.`}
            action={
              filters.email?.endsWith("*") ? null : (
                <Button
                  variant="link"
                  onClick={() =>
                    setFilters({ ...filters, email: `${filters.email}*` })
                  }
                >
                  Try {filters.email}* instead
                </Button>
              )
            }
          />
        )
      ) : (
        <UsersTable users={users} />
      )}
    </MainPage>
  );
}
