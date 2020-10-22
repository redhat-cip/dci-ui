import React, { useState, useEffect } from "react";
import { Location, History } from "history";
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

type JobsStateProps = {
  location: Location;
  history: History;
};

const JobsPage = ({ location, history }: JobsStateProps) => {
  const dispatch = useDispatch();
  const jobs = useSelector(getJobs);
  const isFetching = useSelector(isFetchingJobs);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  function setFiltersUpdateUrlAndSearch(filters: Filters) {
    setFilters(filters);
    const newSearch = createSearchFromFilters(filters);
    history.push(`/jobs${newSearch}`);
    dispatch(jobsActions.clear());
    dispatch(
      jobsActions.all({
        embed: "results,team,remoteci,components,topic",
        ...getParamsFromFilters(filters),
      })
    );
  }
  const { search } = location;

  useEffect(() => {
    const filters = parseFiltersFromSearch(search);
    setFiltersUpdateUrlAndSearch(filters);
  }, []);

  return (
    <Page
      title="Jobs"
      loading={isFetching && isEmpty(jobs)}
      empty={!isFetching && isEmpty(jobs)}
      Toolbar={
        <DCIToolbar
          filters={filters}
          setFilters={setFiltersUpdateUrlAndSearch}
          clearAllFilters={() => setFiltersUpdateUrlAndSearch(defaultFilters)}
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
};

export default JobsPage;
