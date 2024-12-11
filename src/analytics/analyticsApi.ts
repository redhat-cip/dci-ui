import { api } from "api";
import qs from "qs";
import { IGetAnalyticsJobsResponse } from "types";

export const { useLazyGetAnalyticJobsQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAnalyticJobs: builder.query<
        IGetAnalyticsJobsResponse,
        { query: string; after: string; before: string }
      >({
        query: ({ query, after, before }) => {
          const params = qs.stringify(
            {
              query,
              offset: 0,
              limit: 200,
              sort: "-created_at",
              includes:
                "id,name,created_at,keys_values,status,status_reason,comment,duration,pipeline.id,pipeline.created_at,pipeline.name,components.id,components.topic_id,components.display_name,results.errors,results.failures,results.success,results.failures,results.skips,results.total,team.id,team.name",
              from: after,
              to: before,
            },
            {
              addQueryPrefix: true,
              encode: true,
              skipNulls: true,
            },
          );
          return `/analytics/jobs${params}`;
        },
        providesTags: ["Analytics"],
      }),
    }),
  });
