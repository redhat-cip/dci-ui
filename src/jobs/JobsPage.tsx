import { useEffect, useState, useRef } from "react";
import { EmptyState, Breadcrumb } from "ui";
import JobsTableList from "./jobsTableList/JobsTableList";
import JobsToolbar from "./toolbar/JobsToolbar";
import { useNavigate, useLocation } from "react-router";
import {
  Pagination,
  PaginationVariant,
  Content,
  PageSection,
  Skeleton,
} from "@patternfly/react-core";
import type { Filters, JobsTableListColumn } from "types";
import useLocalStorage from "hooks/useLocalStorage";
import { useTitle } from "hooks/useTitle";
import {
  createSearchFromFilters,
  offsetAndLimitToPage,
  pageAndLimitToOffset,
  parseFiltersFromSearch,
  getDefaultFilters,
} from "services/filters";
import { useListJobsQuery } from "./jobsApi";
import LoadingPageSection from "ui/LoadingPageSection";

function Jobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(
    parseFiltersFromSearch(location.search),
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/jobs${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const { data, isLoading, isFetching, refetch } = useListJobsQuery(filters);
  const jobsPageDivRef = useRef<HTMLDivElement>(null);
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

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data || data.jobs.length === 0) {
    return (
      <EmptyState
        title="No job"
        info={
          <span>
            There are no jobs associated with the <b>current team</b>.
          </span>
        }
      />
    );
  }

  const count = data._meta.count;

  return (
    <div ref={jobsPageDivRef}>
      <JobsToolbar
        jobsCount={count}
        filters={filters}
        setFilters={setFilters}
        clearAllFilters={() => setFilters(getDefaultFilters())}
        refresh={refetch}
        tableViewColumns={tableViewColumns}
        setTableViewColumns={setTableViewColumns}
      />
      {count === 0 ? (
        <EmptyState
          title="No job"
          info="No results match the filter criteria. Clear all filters and try again."
        />
      ) : isFetching ? (
        <Skeleton />
      ) : (
        <div>
          <JobsTableList
            filters={filters}
            setFilters={setFilters}
            jobs={data.jobs}
            columns={tableViewColumns}
          />
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
    </div>
  );
}

export default function JobsPage() {
  useTitle("DCI > Jobs");
  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Jobs" }]} />
      <Content component="h1">Jobs</Content>
      <Jobs />
    </PageSection>
  );
}
