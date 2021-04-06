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
import { IJobFilters } from "types";
import { useHistory, useLocation } from "react-router-dom";
import { AppDispatch } from "store";
import { useAuth } from "auth/authContext";

export default function JobsPage() {
  const location = useLocation();
  const history = useHistory();
  const { identity } = useAuth();
  const team_id = identity?.team?.id || null;
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector(getJobs);
  const isFetching = useSelector(isFetchingJobs);
  const [filters, setFilters] = useState<IJobFilters>(
    parseFiltersFromSearch(location.search, team_id)
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

  useEffect(() => {
    setFilters((f) => ({ ...f, team_id }));
  }, [team_id]);

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
      <JobsList filters={filters} setFilters={setFilters} jobs={jobs} />
    </Page>
  );
}
