interface IItemWithStatusAndTags {
  status: string;
  [x: string]: any;
}

export function getPercentageOfSuccessfulJobs(
  jobs: IItemWithStatusAndTags[]
): number {
  if (jobs.length === 0) return 0;

  let nbSuccessfulJob = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    if (job.status === "success") {
      nbSuccessfulJob += 1;
    }
  }

  return Math.round((nbSuccessfulJob * 100) / jobs.length);
}
