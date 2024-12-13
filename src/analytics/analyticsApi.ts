import { api } from "api";
import { createSearchParams } from "react-router";
import { IGetAnalyticsJobsResponse } from "types";

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

export const { useLazyGetAnalyticJobsQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAnalyticJobs: builder.query<
        IGetAnalyticsJobsResponse,
        { query: string; after: string; before: string }
      >({
        query: ({ query, after, before }) => {
          const params = createAnalyticsSearchParams({
            query,
            offset: 0,
            limit: 200,
            sort: "-created_at",
            includes:
              "id,name,created_at,keys_values,status,status_reason,comment,duration,pipeline.id,pipeline.created_at,pipeline.name,components.id,components.topic_id,components.display_name,results.errors,results.failures,results.success,results.failures,results.skips,results.total,team.id,team.name",
            from: after,
            to: before,
          });
          return `/analytics/jobs?${params}`;
        },
        providesTags: ["Analytics"],
      }),
    }),
  });
