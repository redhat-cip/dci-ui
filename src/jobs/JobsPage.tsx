import { useEffect, useCallback, useState } from "react";
import { isEmpty } from "lodash";
import { Page } from "layout";
import { EmptyState, Breadcrumb } from "ui";
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
    <Page
      title="Jobs"
      description=""
      loading={isFetching && isEmpty(jobs)}
      empty={!isFetching && isEmpty(jobs)}
      Toolbar={
        <JobsToolbar
          filters={filters}
          setFilters={setFilters}
          clearAllFilters={() => setFilters(defaultFilters)}
          refresh={getJobsCallback}
        />
      }
      seeSecondToolbar
      EmptyComponent={
        <EmptyState
          title="No job"
          info="There is no job at the moment. Edit your filters to restart a search."
        />
      }
      breadcrumb={
        <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Jobs" }]} />
      }
    >
      <JobsList filters={filters} setFilters={setFilters} jobs={jobs} />
    </Page>
  );
}
