import { api } from "api";
import { IDataFromES, IGraphData } from "types";
import { transform } from "./tasksDurationPerJob";

export const { useLazyGetTasksDurationCumulatedQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTasksDurationCumulated: builder.query<
        IGraphData[],
        { remoteciId: string; topicId: string }
      >({
        query: ({ remoteciId, topicId }) =>
          `/analytics/tasks_duration_cumulated?remoteci_id=${remoteciId}&topic_id=${topicId}`,
        transformResponse: (response: IDataFromES) => {
          return transform(response);
        },
        providesTags: ["Analytics"],
      }),
    }),
  });
