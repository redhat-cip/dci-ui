import { IJob } from "types";

export function groupJobsByPipeline(jobs: IJob[]) {
  const jobsWithPipelinesPerIds: { [id: string]: IJob[] } = {};

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
      let childrenJobs: IJob[] = [];
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
