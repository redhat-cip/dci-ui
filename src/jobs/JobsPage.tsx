import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { Page } from "layout";
import { EmptyState, Breadcrumb } from "ui";
import { useDispatch, useSelector } from "react-redux";
import jobsActions from "./jobsActions";
import { getJobs, isFetchingJobs } from "./jobsSelectors";
import JobsList from "./JobsList";
import DCIToolbar from "./toolbar/DCIToolbar";
import {
  parseFiltersFromSearch,
  getParamsFromFilters,
  createSearchFromFilters,
} from "./toolbar/filters";
import { useHistory, useLocation } from "react-router-dom";
import { AppDispatch } from "store";
import useLocalStorage from "hooks/useLocalStorage";

export default function JobsPage() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector(getJobs);
  const isFetching = useSelector(isFetchingJobs);
  const [filters, setFilters, clearFilters] = useLocalStorage(
    "dci_jobs_filters",
    parseFiltersFromSearch(location.search)
  );

  useEffect(() => {
    const newSearch = createSearchFromFilters(filters);
    history.push(`/jobs${newSearch}`);
  }, [history, filters]);

  useEffect(() => {
    dispatch(jobsActions.clear());
    dispatch(
      jobsActions.all({
        embed: "results,team,remoteci,components,topic",
        ...getParamsFromFilters(filters),
      })
    );
  }, [dispatch, filters]);

  return (
    <Page
      title="Jobs"
      description=""
      loading={isFetching && isEmpty(jobs)}
      empty={!isFetching && isEmpty(jobs)}
      Toolbar={
        <DCIToolbar
          filters={filters}
          setFilters={setFilters}
          clearAllFilters={clearFilters}
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
