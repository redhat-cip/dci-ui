import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  injectDeleteEndpoint,
  injectListEndpoint,
  injectGetEndpoint,
  injectUpdateEndpoint,
  api,
} from "api";
import type {
  IEnhancedJob,
  IGetJobStates,
  IGetTestsResults,
  IJob,
} from "types";
import { sortByName } from "services/sort";

const resource = "Job";

export const { useGetJobQuery } = injectGetEndpoint<IJob>(resource);
export const { useDeleteJobMutation } = injectDeleteEndpoint<IJob>(resource);
export const { useListJobsQuery } = injectListEndpoint<IJob>(resource);
export const { useUpdateJobMutation } = injectUpdateEndpoint<IJob>(resource);
export const { useGetEnhancedJobQuery } = api
  .enhanceEndpoints({ addTagTypes: ["EnhancedJob", resource] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getEnhancedJob: builder.query<IEnhancedJob, string>({
        async queryFn(jobId, _queryApi, _extraOptions, fetchWithBQ) {
          try {
            const getJob = await fetchWithBQ(`/jobs/${jobId}`);
            if (getJob.error) {
              return { error: getJob.error as FetchBaseQueryError };
            }
            const data = getJob.data as { job: IJob };
            const job = data.job;
            const getResults = await fetchWithBQ(`/jobs/${job.id}/results`);
            if (getResults.error) {
              return { error: getResults.error as FetchBaseQueryError };
            }
            const resultsData = getResults.data as IGetTestsResults;
            const getJobState = await fetchWithBQ(`/jobs/${job.id}/jobstates`);
            if (getJobState.error) {
              return { error: getJobState.error as FetchBaseQueryError };
            }
            const jobStatesData = getJobState.data as IGetJobStates;
            const enhancedJob = {
              ...job,
              tests: sortByName(resultsData.results),
              jobstates: jobStatesData.jobstates,
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
