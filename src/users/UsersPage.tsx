import { useEffect, useState } from "react";
import {
  Button,
  ToolbarGroup,
  ToolbarContent,
  Pagination,
  ToolbarItem,
  Toolbar,
  PageSection,
  Content,
  SearchInput,
} from "@patternfly/react-core";
import { PlusCircleIcon, SearchIcon } from "@patternfly/react-icons";
import { EmptyState, Breadcrumb } from "ui";
import type { Filters } from "types";
import CreateUserModal from "./CreateUserModal";
import UsersTable from "./UsersTable";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "services/filters";
import { useLocation, useNavigate } from "react-router";
import { useCreateUserMutation, useListUsersQuery } from "./usersApi";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";

function User() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search),
  );
  const [inputSearch, setInputSearch] = useState<string>("");

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/users${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading } = useListUsersQuery(filters);

  const setFiltersAndResetPagination = (f: Partial<Filters>) => {
    setFilters({
      ...filters,
      ...f,
      offset: 0,
    });
  };

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data) {
    return (
      <EmptyState title="There is no users" info="Do you want to create one?" />
    );
  }

  const count = data._meta.count;

  return (
    <div>
      <Toolbar id="toolbar-users" collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <SearchInput
                placeholder="Search by email"
                value={inputSearch}
                onChange={(e, search) => setInputSearch(search)}
                onSearch={(e, email) => {
                  if (email.trim().endsWith("*")) {
                    setFiltersAndResetPagination({ email });
                  } else {
                    setFiltersAndResetPagination({ email: `${email}*` });
                  }
                }}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup style={{ flex: "1" }}>
            <ToolbarItem variant="pagination" align={{ default: "alignEnd" }}>
              {count === 0 ? null : (
                <Pagination
                  perPage={filters.limit}
                  page={offsetAndLimitToPage(filters.offset, filters.limit)}
                  itemCount={count}
                  onSetPage={(e, newPage) => {
                    setFilters({
                      ...filters,
                      offset: pageAndLimitToOffset(newPage, filters.limit),
                    });
                  }}
                  onPerPageSelect={(e, newPerPage) => {
                    setFilters({ ...filters, limit: newPerPage });
                  }}
                />
              )}
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      {count === 0 ? (
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
                    setFiltersAndResetPagination({ email: `${filters.email}*` })
                  }
                >
                  Try {filters.email}* instead
                </Button>
              )
            }
          />
        )
      ) : (
        <UsersTable users={data.users} />
      )}
    </div>
  );
}

export default function UsersPage() {
  const { currentUser } = useAuth();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  if (currentUser === null) return null;

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Users" }]} />
      <Content component="h1">Users</Content>
      <Content component="p">List of DCI users.</Content>
      {currentUser.isSuperAdmin && (
        <div className="pf-v6-u-mb-md">
          <CreateUserModal onSubmit={createUser}>
            {(openModal) => (
              <Button
                icon={<PlusCircleIcon className="pf-v6-u-mr-xs" />}
                variant="primary"
                onClick={openModal}
                isDisabled={isCreating}
              >
                Create a new user
              </Button>
            )}
          </CreateUserModal>
        </div>
      )}
      <User />
    </PageSection>
  );
}
