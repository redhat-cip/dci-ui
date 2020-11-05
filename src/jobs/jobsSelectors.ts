import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTeamsById } from "teams/teamsSelectors";
import { getRemotecisById } from "remotecis/remotecisSelectors";
import { getTopicsById } from "topics/topicsSelectors";
import { IEnhancedJob, IJobsById } from "types";
import { RootState } from "store";

export const getJobsById = (state: RootState): IJobsById => state.jobs.byId;
export const getJobsAllIds = (state: RootState): string[] => state.jobs.allIds;
export const isFetchingJobs = (state: RootState): boolean =>
  state.jobs.isFetching;
export const getNbOfJobs = (state: RootState): number => state.jobs.count;
export const getJobs = createSelector(
  getRemotecisById,
  getTopicsById,
  getTeamsById,
  getJobsById,
  getJobsAllIds,
  (remotecis, topics, teams, jobs, jobsAllIds) =>
    sortBy<IEnhancedJob>(
      jobsAllIds.map((id) => {
        const job = jobs[id];
        return {
          ...job,
          team: teams[job.team_id],
          topic: topics[job.topic_id],
          remoteci: remotecis[job.remoteci_id],
          tests: [],
          jobstates: [],
          files: [],
        };
      }),
      [(job) => new Date(job.created_at)]
    ).reverse()
);
