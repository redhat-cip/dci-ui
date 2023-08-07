import { useEffect, useCallback, useState, useRef } from "react";
import { EmptyState, Breadcrumb, BlinkLogo } from "ui";
import { useDispatch, useSelector } from "react-redux";
import jobsActions from "./jobsActions";
import { getJobs, getNbOfJobs, isFetchingJobs } from "./jobsSelectors";
import JobsList from "./jobsList/JobsList";
import JobsTableList from "./jobsTableList/JobsTableList";
import JobsToolbar from "./toolbar/JobsToolbar";
import {
  parseFiltersFromSearch,
  getParamsFromFilters,
  createSearchFromFilters,
  defaultFilters,
  resetPageIfNeeded,
} from "./toolbar/filters";
import { useNavigate, useLocation } from "react-router-dom";
import { AppDispatch } from "store";
import {
  Bullseye,
  PageSection,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { JobsTableListColumn } from "types";
import useLocalStorage from "hooks/useLocalStorage";
import { useAuth } from "auth/authContext";
import { useTitle } from "hooks/useTitle";

export default function JobsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { identity } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector(getJobs);
  const isFetching = useSelector(isFetchingJobs);
  const jobsCount = useSelector(getNbOfJobs);
  const [filters, setFilters] = useState(
    parseFiltersFromSearch(location.search),
  );
  const jobsPageDivRef = useRef<HTMLInputElement>(null);
  const [tableViewActive, setTableViewActive] = useLocalStorage(
    "tableViewActive",
    false,
  );
  const [tableViewColumns, setTableViewColumns] = useLocalStorage<
    JobsTableListColumn[]
  >(
    "tableViewColumns",
    ["name", "team", "remoteci", "topic", "component", "duration", "started"],
    4,
  );
  useTitle("DCI > Jobs");
  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/jobs${newSearch}`, { replace: true });
  }, [navigate, filters]);

  const getJobsCallback = useCallback(() => {
    dispatch(jobsActions.clear());
    if (!identity || !identity.team) return;
    if (identity.hasReadOnlyRole || filters.team_id !== null) {
      dispatch(jobsActions.all(getParamsFromFilters(filters)));
    } else {
      dispatch(
        jobsActions.all(
          getParamsFromFilters({ ...filters, team_id: identity.team.id }),
        ),
      );
    }
  }, [identity, dispatch, filters]);

  useEffect(() => {
    getJobsCallback();
  }, [getJobsCallback]);

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
          jobsCount={jobsCount}
          filters={filters}
          setFilters={(newFilters) =>
            setFilters(resetPageIfNeeded(filters, newFilters))
          }
          clearAllFilters={() => setFilters({ ...defaultFilters })}
          refresh={getJobsCallback}
          tableViewActive={tableViewActive}
          setTableViewActive={setTableViewActive}
          tableViewColumns={tableViewColumns}
          setTableViewColumns={setTableViewColumns}
        />
        {isFetching && (
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
        {!isFetching && jobs.length === 0 && (
          <EmptyState
            title="No job"
            info="There is no job at the moment. Edit your filters to restart a search."
          />
        )}
        {tableViewActive ? (
          <JobsTableList
            filters={filters}
            setFilters={(newFilters) =>
              setFilters(resetPageIfNeeded(filters, newFilters))
            }
            jobs={jobs}
            columns={tableViewColumns}
          />
        ) : (
          <JobsList
            filters={filters}
            setFilters={(newFilters) =>
              setFilters(resetPageIfNeeded(filters, newFilters))
            }
            jobs={jobs}
          />
        )}
        {jobs.length > 0 && (
          <div className="pf-v5-u-background-color-100">
            <Pagination
              className="pf-v5-u-px-md"
              perPage={filters.perPage}
              page={filters.page}
              itemCount={jobsCount}
              variant={PaginationVariant.bottom}
              onSetPage={(e, page) => {
                jobsPageDivRef?.current?.scrollIntoView();
                setFilters({ ...filters, page });
              }}
              onPerPageSelect={(e, perPage) => {
                jobsPageDivRef?.current?.scrollIntoView();
                const newFilters = { ...filters, perPage };
                setFilters(resetPageIfNeeded(filters, newFilters));
              }}
            />
          </div>
        )}
      </PageSection>
    </div>
  );
}
