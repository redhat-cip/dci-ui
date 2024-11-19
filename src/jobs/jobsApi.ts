import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  injectDeleteEndpoint,
  injectListEndpoint,
  injectGetEndpoint,
  injectUpdateEndpoint,
  api,
} from "api";
import type { IEnhancedJob, IJob, ITest } from "../types";
import { getResults } from "./job/tests/testsApi";
import { getJobStatesWithFiles } from "./job/jobStates/jobStatesApi";
import { sortByName } from "services/sort";

const resource = "Job";

export const { useGetJobQuery } = injectGetEndpoint<IJob>(resource);
export const { useDeleteJobMutation } = injectDeleteEndpoint<IJob>(resource);
export const { useListJobsQuery } = injectListEndpoint<IJob>(resource);
export const { useUpdateJobMutation } = injectUpdateEndpoint<IJob>(resource);
export const { useGetEnhancedJobQuery } = api
  .enhanceEndpoints({
    addTagTypes: ["EnhancedJob", resource],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getEnhancedJob: builder.query<IEnhancedJob, string>({
        async queryFn(jobId, _queryApi, _extraOptions, fetchWithBQ) {
          const getJob = await fetchWithBQ(`/jobs/${jobId}`);
          if (getJob.error)
            return { error: getJob.error as FetchBaseQueryError };
          try {
            const data = getJob.data as { job: IJob };
            const job = data.job;
            const q1 = await getResults(job);
            const q2 = await getJobStatesWithFiles(job);
            const enhancedJob = {
              ...job,
              tests: sortByName<ITest>(q1.data.results),
              jobstates: q2.data.jobstates,
            };
            return { data: enhancedJob as IEnhancedJob };
          } catch (error: unknown) {
            console.error(error);
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: `Can't fetch test results or job states for job ${jobId}`,
              } as FetchBaseQueryError,
            };
          }
        },
        providesTags: (result, error, id) => [
          { type: "EnhancedJob", id },
          { type: resource, id },
        ],
      }),
    }),
  });
