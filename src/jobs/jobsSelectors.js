import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTeamsById } from "teams/teamsSelectors";
import { getRemotecisById } from "remotecis/remotecisSelectors";
import { getComponentsById } from "components/componentSelectors";
import { getTopicsById } from "topics/topicsSelectors";

export const getJobsById = state => state.jobs.byId;
export const getJobsAllIds = state => state.jobs.allIds;
export const getJobs = createSelector(
  getRemotecisById,
  getTopicsById,
  getTeamsById,
  getComponentsById,
  getJobsById,
  getJobsAllIds,
  (remotecis, topics, teams, components, jobs, jobsAllIds) =>
    sortBy(
      jobsAllIds.map(id => {
        const job = jobs[id];
        return {
          ...job,
          team: teams[job.team_id],
          topic: topics[job.topic_id],
          components: job.components.map(cId => components[cId]),
          remoteci: remotecis[job.remoteci_id]
        };
      }),
      [job => new Date(job.created_at)]
    ).reverse()
);
