import { useEffect, useState, useRef } from "react";
import { EmptyState, Breadcrumb, BlinkLogo } from "ui";
import JobsList from "./jobsList/JobsList";
import JobsTableList from "./jobsTableList/JobsTableList";
import JobsToolbar from "./toolbar/JobsToolbar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bullseye,
  PageSection,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { Filters, JobsTableListColumn } from "types";
import useLocalStorage from "hooks/useLocalStorage";
import { useAuth } from "auth/authContext";
import { useTitle } from "hooks/useTitle";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
  getDefaultFilters,
} from "api/filters";
import { useListJobsQuery } from "./jobsApi";

export default function JobsPage() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search),
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/jobs${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const filtersWithTeamId =
    currentUser === null ||
    currentUser.hasReadOnlyRole ||
    filters.team_id !== null
      ? { ...filters }
      : { ...filters, team_id: currentUser.team?.id };
  const { data, isLoading, refetch } = useListJobsQuery(filtersWithTeamId);
  // const [trigger] = useListJobsLazyQuery()

  const jobsPageDivRef = useRef<HTMLInputElement>(null);
  const [tableViewActive, setTableViewActive] = useLocalStorage(
    "tableViewActive",
    true,
  );
  const [tableViewColumns, setTableViewColumns] = useLocalStorage<
    JobsTableListColumn[]
  >(
    "tableViewColumns",
    ["name", "team", "remoteci", "topic", "component", "duration", "started"],
    4,
  );
  useTitle("DCI > Jobs");

  if (!data || currentUser === null) return null;

  const count = data._meta.count;

  return (
    <div ref={jobsPageDivRef}>
      <section className="pf-v5-c-page__main-breadcrumb">
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Jobs" }]} />
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Jobs</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <JobsToolbar
          jobsCount={count}
          filters={filters}
          setFilters={setFilters}
          clearAllFilters={() => setFilters(getDefaultFilters())}
          refresh={refetch}
          tableViewActive={tableViewActive}
          setTableViewActive={setTableViewActive}
          tableViewColumns={tableViewColumns}
          setTableViewColumns={setTableViewColumns}
        />
        {isLoading && (
          <PageSection
            variant={PageSectionVariants.default}
            style={{ height: "80vh" }}
            isFilled={true}
          >
            <Bullseye>
              <BlinkLogo />
            </Bullseye>
          </PageSection>
        )}
        {!isLoading && count === 0 && (
          <EmptyState
            title="No job"
            info="There is no job at the moment. Edit your filters to restart a search."
          />
        )}
        {tableViewActive ? (
          <JobsTableList
            filters={filters}
            setFilters={setFilters}
            jobs={data.jobs}
            columns={tableViewColumns}
          />
        ) : (
          <JobsList
            filters={filters}
            setFilters={setFilters}
            jobs={data.jobs}
          />
        )}
        {count > 0 && (
          <div className="pf-v5-u-background-color-100">
            <Pagination
              className="pf-v5-u-px-md"
              perPage={filters.limit}
              page={offsetAndLimitToPage(filters.offset, filters.limit)}
              itemCount={count}
              variant={PaginationVariant.bottom}
              onSetPage={(e, newPage) => {
                jobsPageDivRef?.current?.scrollIntoView();
                setFilters({
                  ...filters,
                  offset: pageAndLimitToOffset(newPage, filters.limit),
                });
              }}
              onPerPageSelect={(e, newPerPage) => {
                jobsPageDivRef?.current?.scrollIntoView();
                setFilters({ ...filters, limit: newPerPage });
              }}
            />
          </div>
        )}
      </PageSection>
    </div>
  );
}
