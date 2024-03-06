import * as React from "react";
import { IEnhancedJob } from "types";
import { useParams } from "react-router";
import { useGetEnhancedJobQuery } from "jobs/jobsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import JobDetailsEnvelope from "./JobDetailsEnvelope";
import JobDetailsSkeleton from "./JobDetailsSkeleton";
import { BlinkLogo } from "ui";
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";

export type JobContextProps = {
  job: IEnhancedJob;
};

const JobContext = React.createContext({} as JobContextProps);

type JobProviderProps = {
  children: React.ReactNode;
};

function JobProvider({ children }: JobProviderProps) {
  const navigate = useNavigate();
  const { job_id = "" } = useParams();
  const { data: job, isLoading } = useGetEnhancedJobQuery(
    job_id ? job_id : skipToken,
  );

  if (isLoading) {
    return (
      <JobDetailsEnvelope job_id={job_id}>
        <JobDetailsSkeleton>
          <EmptyState>
            <EmptyStateHeader icon={<EmptyStateIcon icon={BlinkLogo} />} />
          </EmptyState>
        </JobDetailsSkeleton>
      </JobDetailsEnvelope>
    );
  }

  if (!job) {
    return (
      <JobDetailsEnvelope job_id={job_id}>
        <JobDetailsSkeleton>
          <EmptyState variant={EmptyStateVariant.xs}>
            <EmptyStateHeader titleText="No job" headingLevel="h4" />
            <EmptyStateBody>
              We can't get the job with id {job_id}.
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={() => navigate("/jobs")}>
                  See jobs
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        </JobDetailsSkeleton>
      </JobDetailsEnvelope>
    );
  }

  return (
    <JobContext.Provider value={{ job }}>
      <JobDetailsEnvelope job_id={job_id}>{children}</JobDetailsEnvelope>
    </JobContext.Provider>
  );
}

const useJob = () => React.useContext(JobContext);

export { JobProvider, useJob };
