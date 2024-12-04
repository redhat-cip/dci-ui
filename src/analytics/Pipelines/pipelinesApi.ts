import { api } from "api";
import { IPipelines } from "types";

export const { useLazyGetPipelineStatusQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getPipelineStatus: builder.query<
        IPipelines,
        {
          start_date: string;
          end_date: string;
          teams_ids: string[];
          pipelines_names?: string[];
        }
      >({
        query: (body) => {
          return {
            url: `/analytics/pipelines_status`,
            method: "POST",
            body,
          };
        },
        providesTags: ["Analytics"],
      }),
    }),
  });
