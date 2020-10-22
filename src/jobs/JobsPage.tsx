import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { Page } from "layout";
import { EmptyState } from "ui";
import { useDispatch, useSelector } from "react-redux";
import jobsActions from "./jobsActions";
import { getJobs, isFetchingJobs } from "./jobsSelectors";
import JobsList from "./JobsList";
import DCIToolbar from "./toolbar/DCIToolbar";
import {
  parseFiltersFromSearch,
  getParamsFromFilters,
  createSearchFromFilters,
  defaultFilters,
} from "./toolbar/filters";
import { Filters } from "types";
import { useHistory, useLocation } from "react-router-dom";

export default function JobsPage() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const jobs = useSelector(getJobs);
  const isFetching = useSelector(isFetchingJobs);
  const [filters, setFilters] = useState<Filters>(
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
      loading={isFetching && isEmpty(jobs)}
      empty={!isFetching && isEmpty(jobs)}
      Toolbar={
        <DCIToolbar
          filters={filters}
          setFilters={setFilters}
          clearAllFilters={() => setFilters(defaultFilters)}
        />
      }
      seeSecondToolbar
      EmptyComponent={
        <EmptyState
          title="No job"
          info="There is no job at the moment. Edit your filters to restart a search."
        />
      }
    >
      <JobsList jobs={jobs} />
    </Page>
  );
}
