import type { JobNode, IJob } from "types";

export function groupJobsByPipeline(jobs: IJob[]): JobNode[] {
  const jobWithChildrenMap: { [id: string]: JobNode } = {};
  const jobNodes: JobNode[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    jobWithChildrenMap[job.id] = { ...job, index: i, children: [] };
  }

  for (let i = jobs.length - 1; i >= 0; --i) {
    const job = jobs[i];
    const node = jobWithChildrenMap[job.id];
    if (job.previous_job_id && jobWithChildrenMap[job.previous_job_id]) {
      const parentNode = jobWithChildrenMap[job.previous_job_id];
      parentNode?.children.push(node);
    } else {
      jobNodes.push(node);
    }
  }
  return jobNodes.sort((j1, j2) => j1.index - j2.index);
}
