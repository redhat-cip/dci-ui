import { useEffect, useCallback, useState } from "react";
import { EmptyState, Breadcrumb, BlinkLogo } from "ui";
import { useDispatch, useSelector } from "react-redux";
import jobsActions from "./jobsActions";
import { getJobs, isFetchingJobs } from "./jobsSelectors";
import JobsList from "./JobsList";
import JobsToolbar from "./toolbar/JobsToolbar";
import {
  parseFiltersFromSearch,
  getParamsFromFilters,
  createSearchFromFilters,
  defaultFilters,
} from "./toolbar/filters";
import { useNavigate, useLocation } from "react-router-dom";
import { AppDispatch } from "store";
import {
  Bullseye,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";

export default function JobsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector(getJobs);
  const isFetching = useSelector(isFetchingJobs);
  const [filters, setFilters] = useState(
    parseFiltersFromSearch(location.search)
  );
  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    navigate(`/jobs${newSearch}`);
  }, [navigate, filters]);

  const getJobsCallback = useCallback(() => {
    dispatch(jobsActions.clear());
    dispatch(jobsActions.all(getParamsFromFilters(filters)));
  }, [dispatch, filters]);

  useEffect(() => {
    getJobsCallback();
  }, [getJobsCallback]);

  return (
    <div>
      <section className="pf-c-page__main-breadcrumb">
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Jobs" }]} />
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Jobs</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <JobsToolbar
          filters={filters}
          setFilters={setFilters}
          clearAllFilters={() => setFilters(defaultFilters)}
          refresh={getJobsCallback}
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
        <JobsList filters={filters} setFilters={setFilters} jobs={jobs} />
        {jobs.length >= 20 && (
          <JobsToolbar
            filters={filters}
            setFilters={setFilters}
            clearAllFilters={() => setFilters(defaultFilters)}
            refresh={getJobsCallback}
          />
        )}
      </PageSection>
    </div>
  );
}
