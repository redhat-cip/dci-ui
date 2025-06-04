import { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { api } from "api";
import { createSearchParams } from "react-router";
import {
  IAnalyticsData,
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";

export function createAnalyticsSearchParams(
  obj: Record<string, string | string[] | number | null>,
) {
  return createSearchParams(
    Object.entries(obj).reduce(
      (acc, [key, value]) => {
        if (value instanceof Array && value.length === 0) {
          return acc;
        }
        if (value !== null && value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  ).toString();
}

async function getAnalyticsJobs(
  args: {
    query: string;
    after: string;
    before: string;
    includes: string;
  },
  fetchWithBQ: (arg: Parameters<BaseQueryFn>[0]) => ReturnType<BaseQueryFn>,
) {
  const { query, after, before, includes } = args;
  let offset = 0;
  const limit = 200;
  const analyticsJobs: IAnalyticsData = {
    jobs: [],
    _meta: { first_sync_date: "", last_sync_date: "" },
  };
  let total = Infinity;

  try {
    while (offset < total) {
      const params = createAnalyticsSearchParams({
        query,
        offset,
        limit,
        sort: "-created_at",
        includes,
        from: after,
        to: before,
      });

      const response = await fetchWithBQ(`/analytics/jobs?${params}`);
      if (response.error) {
        return { error: response.error as FetchBaseQueryError };
      }

      const data = response.data as
        | IGetAnalyticsJobsResponse
        | IGetAnalyticsJobsEmptyResponse;
      analyticsJobs._meta = data._meta
      if (!data.hits) break;
      analyticsJobs.jobs = [
        ...analyticsJobs.jobs,
        ...data.hits.hits.map((h) => h._source),
      ];
      total = data.hits.total.value;
      offset += limit;
    }
    return {
      data: analyticsJobs,
    };
  } catch (error) {
    return { error: error as FetchBaseQueryError };
  }
}

export const { useLazyGetAnalyticJobsQuery, useGetAnalyticJobsQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAnalyticJobs: builder.query<
        IAnalyticsData,
        { query: string; after: string; before: string; includes?: string }
      >({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return getAnalyticsJobs(
            {
              ..._arg,
              includes:
                "id,name,configuration,created_at,tags,keys_values,topic.name,url,status,status_reason,comment,duration,pipeline.id,pipeline.created_at,pipeline.name,components.id,components.topic_id,components.display_name,components.type,results.errors,results.failures,results.success,results.failures,results.skips,results.total,team.id,team.name,remoteci.name",
            },
            fetchWithBQ,
          );
        },
        providesTags: ["Analytics"],
      }),
    }),
  });
