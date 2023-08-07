import { createSelector } from "reselect";
import { getTeamsById } from "teams/teamsSelectors";
import { getRemotecisById } from "remotecis/remotecisSelectors";
import { getTopicsById } from "topics/topicsSelectors";
import { IEnhancedJob, IJobsById } from "types";
import { RootState } from "store";
import { sortByNewestFirst } from "services/sort";

export const getJobsById = (state: RootState): IJobsById => state.jobs.byId;
export const getJobsAllIds = (state: RootState): string[] => state.jobs.allIds;
export const isFetchingJobs = (state: RootState): boolean =>
  state.jobs.isFetching;
export const getNbOfJobs = (state: RootState): number => state.jobs.count;

export function groupJobsByPipeline(jobs: IEnhancedJob[]) {
  const jobsWithPipelinesPerIds: { [id: string]: IEnhancedJob[] } = {};

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const previous_job_id = job.previous_job_id;
    const jobId = job.id;
    const key = previous_job_id || jobId;
    const jobsWithPipelines = jobsWithPipelinesPerIds[key] || [];
    jobsWithPipelinesPerIds[key] = jobsWithPipelines;
    if (previous_job_id === null) {
      jobsWithPipelinesPerIds[key].unshift(job);
    } else {
      let childrenJobs: IEnhancedJob[] = [];
      if (jobId in jobsWithPipelinesPerIds) {
        childrenJobs = jobsWithPipelinesPerIds[jobId];
        delete jobsWithPipelinesPerIds[jobId];
      }
      const siblingJobs = jobsWithPipelinesPerIds[key];
      jobsWithPipelinesPerIds[key] = [job, ...siblingJobs, ...childrenJobs];
    }
  }
  return Object.values(jobsWithPipelinesPerIds);
}

export const getJobs = createSelector(
  getRemotecisById,
  getTopicsById,
  getTeamsById,
  getJobsById,
  getJobsAllIds,
  (remotecis, topics, teams, jobs, jobsAllIds) =>
    sortByNewestFirst(
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
    ),
);
