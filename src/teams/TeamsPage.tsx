import { useEffect, useState } from "react";
import MainPage from "pages/MainPage";
import { EmptyState, Breadcrumb, CopyButton, InputFilter } from "ui";
import CreateTeamModal from "./CreateTeamModal";
import {
  Button,
  Flex,
  FlexItem,
  Label,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TeamCreationWizard from "./TeamCreationWizard";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useAuth } from "auth/authContext";
import { Filters } from "types";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
} from "api/filters";
import { useCreateTeamMutation, useListTeamsQuery } from "./teamsApi";
import { fromNow } from "services/date";

export default function TeamsPage() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search),
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/teams${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading } = useListTeamsQuery(filters);
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();

  if (!data || currentUser === null) return null;

  const count = data._meta.count;

  const partners = data.teams.filter((t) => t.external && t.state === "active");

  return (
    <MainPage
      title="Teams"
      description={
        partners.length > 0
          ? `List of DCI teams. There are ${partners.length} active partners.`
          : "List of DCI teams."
      }
      loading={isLoading}
      empty={data.teams.length === 0}
      HeaderButton={
        currentUser.hasEPMRole ? (
          <Flex>
            <Flex>
              <FlexItem>
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
              </FlexItem>
              <FlexItem>
                <TeamCreationWizard />
              </FlexItem>
            </Flex>
          </Flex>
        ) : null
      }
      EmptyComponent={
        <EmptyState
          title="There is no teams"
          info="Do you want to create one?"
        />
      }
      Breadcrumb={
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Teams" }]} />
      }
      Toolbar={
        <Toolbar id="toolbar-teams" collapseListedFiltersBreakpoint="xl">
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <InputFilter
                  search={filters.name || ""}
                  placeholder="Search a team"
                  onSearch={(name) => {
                    setFilters({
                      ...filters,
                      name,
                    });
                  }}
                />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup style={{ flex: "1" }}>
              <ToolbarItem
                variant="pagination"
                align={{ default: "alignRight" }}
              >
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
      }
    >
      <Table
        className="pf-v5-c-table pf-m-compact pf-m-grid-md"
        role="grid"
        aria-label="Teams table"
        id="teams-table"
      >
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
              <Th>
                <CopyButton text={team.id} />
              </Th>
              <Th>
                <Link to={`/teams/${team.id}`}>{team.name}</Link>
              </Th>
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
    </MainPage>
  );
}
