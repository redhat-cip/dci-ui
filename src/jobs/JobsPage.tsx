import { useEffect, useState, useRef } from "react";
import { EmptyState, Breadcrumb, BlinkLogo } from "ui";
import JobsTableList from "./jobsTableList/JobsTableList";
import JobsToolbar from "./toolbar/JobsToolbar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bullseye,
  PageSection,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  Content,
} from "@patternfly/react-core";
import { Filters, JobsTableListColumn } from "types";
import useLocalStorage from "hooks/useLocalStorage";
import { useAuth } from "auth/authSelectors";
import { useTitle } from "hooks/useTitle";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
  getDefaultFilters,
} from "services/filters";
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

  const jobsPageDivRef = useRef<HTMLInputElement>(null);
  const [tableViewColumns, setTableViewColumns] = useLocalStorage<
    JobsTableListColumn[]
  >(
    "tableViewColumns",
    [
      "pipeline",
      "team",
      "remoteci",
      "topic",
      "component",
      "tests",
      "duration",
      "started",
    ],
    5,
  );
  useTitle("DCI > Jobs");

  if (!data || currentUser === null) return null;

  const count = data._meta.count;

  return (
    <div ref={jobsPageDivRef}>
      <section className="pf-v6-c-page__main-breadcrumb">
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Jobs" }]} />
      </section>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Jobs</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false} variant={PageSectionVariants.default}>
        <JobsToolbar
          jobsCount={count}
          filters={filters}
          setFilters={setFilters}
          clearAllFilters={() => setFilters(getDefaultFilters())}
          refresh={refetch}
          tableViewColumns={tableViewColumns}
          setTableViewColumns={setTableViewColumns}
        />
        {isLoading && (
          <PageSection
            hasBodyWrapper={false}
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
        <JobsTableList
          filters={filters}
          setFilters={setFilters}
          jobs={data.jobs}
          columns={tableViewColumns}
        />
        {count > 0 && (
          <div>
            <Pagination
              className="pf-v6-u-px-md"
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
