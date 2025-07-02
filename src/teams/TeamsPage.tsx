import { useEffect, useState } from "react";
import { EmptyState, Breadcrumb, CopyButton } from "ui";
import CreateTeamModal from "./CreateTeamModal";
import {
  Button,
  Content,
  Label,
  PageSection,
  Pagination,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { Link, useLocation, useNavigate } from "react-router";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useAuth } from "auth/authSelectors";
import type { Filters } from "types";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "services/filters";
import { useCreateTeamMutation, useListTeamsQuery } from "./teamsApi";
import { fromNow } from "services/date";
import LoadingPageSection from "ui/LoadingPageSection";

function Teams() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search),
  );
  const [inputSearch, setInputSearch] = useState<string>("");

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/teams${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading } = useListTeamsQuery(filters);

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data) {
    return (
      <EmptyState title="There is no teams" info="Do you want to create one?" />
    );
  }

  const count = data._meta.count;
  return (
    <div>
      <Toolbar id="toolbar-teams" collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <SearchInput
                placeholder="Search a team"
                value={inputSearch}
                onChange={(e, search) => setInputSearch(search)}
                onSearch={(e, name) => {
                  if (name.trim().endsWith("*")) {
                    setFilters({
                      ...filters,
                      name,
                    });
                  } else {
                    setFilters({
                      ...filters,
                      name: `${name}*`,
                    });
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
        <EmptyState
          title="There is no teams"
          info="Do you want to create one?"
        />
      ) : (
        <Table id="teams-table" aria-label="Teams table">
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Team Name</Th>
              <Th>Partner</Th>
              <Th>Active</Th>
              <Th>Created at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.teams.map((team) => (
              <Tr key={team.id}>
                <Td isActionCell>
                  <CopyButton text={team.id} />
                </Td>
                <Td>
                  <Link to={`/teams/${team.id}`}>{team.name}</Link>
                </Td>
                <Td>
                  {team.external ? <Label color="blue">partner</Label> : null}
                </Td>
                <Td>
                  {team.state === "active" ? (
                    <Label color="green">active</Label>
                  ) : (
                    <Label color="red">inactive</Label>
                  )}
                </Td>
                <Td>{fromNow(team.created_at)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}

export default function TeamsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  if (currentUser === null) return null;
  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Teams" }]} />
      <Content component="h1">Teams</Content>
      <Content component="p">List of DCI teams.</Content>
      {currentUser.hasEPMRole && (
        <div className="pf-v6-u-mb-md">
          <CreateTeamModal
            onSubmit={async (team) => {
              try {
                const newTeam = await createTeam(team).unwrap();
                navigate(`/teams/${newTeam.id}`);
              } catch (error) {
                console.error("rejected", error);
              }
            }}
          >
            {(openModal) => (
              <Button
                variant="primary"
                onClick={openModal}
                isDisabled={isCreating}
              >
                Create a new team
              </Button>
            )}
          </CreateTeamModal>
        </div>
      )}
      <Teams />
    </PageSection>
  );
}
