import http from "services/http";
import {
  injectCreateEndpoint,
  injectGetEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
  api,
} from "api";
import type { IComponent, ITopic } from "../types";

const resource = "Topic";

export const { useCreateTopicMutation } =
  injectCreateEndpoint<ITopic>(resource);
export const { useGetTopicQuery } = injectGetEndpoint<ITopic>(resource);
export const { useListTopicsQuery } = injectListEndpoint<ITopic>(resource);
export const { useUpdateTopicMutation } =
  injectUpdateEndpoint<ITopic>(resource);

export const {
  useSubscribeToATopicMutation,
  useUnsubscribeFromATopicMutation,
  useListSubscribedTopicsQuery,
} = api
  .enhanceEndpoints({
    addTagTypes: ["CurrentUserTopic"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      listSubscribedTopics: builder.query<
        {
          _meta: { count: number };
          topics: ITopic[];
        },
        void
      >({
        query: () => "/topics/notifications",
        providesTags: [{ type: "CurrentUserTopic", id: "LIST" }],
      }),
      subscribeToATopic: builder.mutation<void, ITopic>({
        query(topic) {
          return {
            url: `/topics/${topic.id}/notifications`,
            method: "POST",
            body: {},
          };
        },
        invalidatesTags: ["CurrentUserTopic"],
      }),
      unsubscribeFromATopic: builder.mutation<
        { success: boolean; id: string },
        ITopic
      >({
        query(topic) {
          return {
            url: `/topics/${topic.id}/notifications`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["CurrentUserTopic"],
      }),
    }),
  });

interface IFetchComponents {
  data: {
    components: IComponent[];
    _meta: { count: number };
  };
}

export function fetchComponents(
  topic_id: string,
  search: string,
): Promise<IFetchComponents> {
  return http({
    method: "get",
    url: `/api/v1/topics/${topic_id}/components${search}`,
  });
}
