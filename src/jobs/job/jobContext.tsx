import { useEffect, useState } from "react";
import * as React from "react";
import { IEnhancedJob, ITest } from "types";
import { useParams } from "react-router";
import jobsActions from "jobs/jobsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { getResults } from "jobs/job/tests/testsActions";
import { getJobStatesWithFiles } from "jobs/job/jobStates/jobStatesActions";
import { sortByName } from "services/sort";
import LoadingPage from "pages/LoadingPage";

export type JobContextProps = {
  job: IEnhancedJob;
};

const JobContext = React.createContext({} as JobContextProps);

type JobProviderProps = {
  children: React.ReactNode;
};

function JobProvider({ children }: JobProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = React.useState<IEnhancedJob | null>(null);
  const { job_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (job_id) {
      setIsLoading(true)
      dispatch(jobsActions.one(job_id))
        .then(async (response) => {
          const job = response.data.job;
          const q1 = await getResults(job);
          const q2 = await getJobStatesWithFiles(job);
          const enhancedJob = {
            ...job,
            tests: sortByName<ITest>(q1.data.results),
            jobstates: q2.data.jobstates,
          };
          setJob(enhancedJob);
          return response;
        })
        .finally(() => setIsLoading(false));
    }
  }, [job_id, dispatch]);

  if (isLoading || job === null) {
    return <LoadingPage title="Job Details" />;
  }
  return <JobContext.Provider value={{ job }}>{children}</JobContext.Provider>;
}

const useJob = () => React.useContext(JobContext);

export { JobProvider, useJob };
