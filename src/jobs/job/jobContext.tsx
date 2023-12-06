import * as React from "react";
import { IEnhancedJob } from "types";
import { useParams } from "react-router";
import LoadingPage from "pages/LoadingPage";
import { useGetEnhancedJobQuery } from "jobs/jobsApi";
import { skipToken } from "@reduxjs/toolkit/query";

export type JobContextProps = {
  job: IEnhancedJob;
};

const JobContext = React.createContext({} as JobContextProps);

type JobProviderProps = {
  children: React.ReactNode;
};

function JobProvider({ children }: JobProviderProps) {
  const { job_id } = useParams();
  const { data: job, isLoading } = useGetEnhancedJobQuery(
    job_id ? job_id : skipToken,
  );

  if (isLoading || !job) {
    return <LoadingPage title="Job Details" />;
  }
  return <JobContext.Provider value={{ job }}>{children}</JobContext.Provider>;
}

const useJob = () => React.useContext(JobContext);

export { JobProvider, useJob };
