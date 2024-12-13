import { createAnalyticsSearchParams } from "analytics/analyticsApi";
import { api } from "api";
import { IComponentCoverageESData } from "types";

export const {
  useLazyGetAllComponentTypesQuery,
  useLazyGetTasksComponentsCoverageQuery,
} = api.enhanceEndpoints({ addTagTypes: ["Analytics"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllComponentTypes: builder.query<string[], string>({
      query: (topicId) =>
        `/analytics/tasks_components_coverage?topic_id=${topicId}`,
      transformResponse: (response: IComponentCoverageESData) => {
        return response.hits.map((component) => component._source.type);
      },
      providesTags: ["Analytics"],
    }),
    getTasksComponentsCoverage: builder.query<
      IComponentCoverageESData,
      {
        topicId: string | null;
        selectedTypes: string[];
        teamId: string | null;
      }
    >({
      query: ({ teamId, topicId, selectedTypes }) => {
        const newSearch = createAnalyticsSearchParams({
          team_id: teamId,
          topic_id: topicId,
          types: selectedTypes,
        });
        return `/analytics/tasks_components_coverage?${newSearch}`;
      },

      providesTags: ["Analytics"],
    }),
  }),
});
