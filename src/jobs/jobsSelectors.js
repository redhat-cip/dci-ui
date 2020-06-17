import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTeamsById } from "teams/teamsSelectors";
import { getRemotecisById } from "remotecis/remotecisSelectors";
import { getTopicsById } from "topics/topicsSelectors";
import { formatDate, humanizeDuration } from "services/date";

export function enhanceJob(job) {
  return {
    ...job,
    datetime: formatDate(job.created_at),
    humanizedDuration: humanizeDuration(job.duration * 1000),
  };
}

export const getJobsById = (state) => state.jobs.byId;
export const getJobsAllIds = (state) => state.jobs.allIds;
export const getJobs = createSelector(
  getRemotecisById,
  getTopicsById,
  getTeamsById,
  getJobsById,
  getJobsAllIds,
  (remotecis, topics, teams, jobs, jobsAllIds) =>
    sortBy(
      jobsAllIds.map((id) => {
        const job = jobs[id];
        return enhanceJob({
          ...job,
          team: teams[job.team_id],
          topic: topics[job.topic_id],
          remoteci: remotecis[job.remoteci_id],
        });
      }),
      [(job) => new Date(job.created_at)]
    ).reverse()
);
