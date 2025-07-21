import type { JobNode, IJob } from "types";

export function groupJobsByPipeline(jobs: IJob[]): {
  jobNodes: JobNode[];
  maxLevel: number;
} {
  const jobWithChildrenMap: { [id: string]: JobNode } = {};
  const jobNodes: JobNode[] = [];
  let maxLevel = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    jobWithChildrenMap[job.id] = { ...job, index: i, children: [], level: 0 };
  }

  for (let i = jobs.length - 1; i >= 0; --i) {
    const job = jobs[i];
    const node = jobWithChildrenMap[job.id];
    if (job.previous_job_id && jobWithChildrenMap[job.previous_job_id]) {
      const parentNode = jobWithChildrenMap[job.previous_job_id];
      node.level = (parentNode.level ?? 0) + 1;
      maxLevel = Math.max(maxLevel, node.level);
      parentNode?.children.push(node);
    } else {
      node.level = 0;
      jobNodes.push(node);
    }
  }
  return {
    jobNodes: jobNodes.sort((j1, j2) => j1.index - j2.index),
    maxLevel,
  };
}
