import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTeamsById } from "teams/teamsSelectors";
import { getRemotecisById } from "remotecis/remotecisSelectors";
import { getTopicsById } from "topics/topicsSelectors";
import { getTimezone } from "currentUser/currentUserSelectors";
import { formatDate, humanizeDuration } from "services/date";

export const getJobsById = state => state.jobs.byId;
export const getJobsAllIds = state => state.jobs.allIds;
export const getJobs = createSelector(
  getRemotecisById,
  getTopicsById,
  getTeamsById,
  getTimezone,
  getJobsById,
  getJobsAllIds,
  (remotecis, topics, teams, currentUserTimezone, jobs, jobsAllIds) =>
    sortBy(
      jobsAllIds.map(id => {
        const job = jobs[id];
        return {
          ...job,
          team: teams[job.team_id],
          topic: topics[job.topic_id],
          remoteci: remotecis[job.remoteci_id],
          datetime: formatDate(job.created_at, currentUserTimezone),
          humanizedDuration: humanizeDuration(job.duration)
        };
      }),
      [job => new Date(job.created_at)]
    ).reverse()
);
