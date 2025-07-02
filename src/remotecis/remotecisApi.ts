import {
  injectCreateEndpoint,
  injectGetEndpoint,
  injectDeleteEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
  api,
} from "api";
import type { ICurrentUser, IRemoteci } from "types";

const resource = "Remoteci";

export const { useCreateRemoteciMutation } =
  injectCreateEndpoint<IRemoteci>(resource);
export const { useGetRemoteciQuery } = injectGetEndpoint<IRemoteci>(resource);
export const { useDeleteRemoteciMutation } =
  injectDeleteEndpoint<IRemoteci>(resource);
export const { useListRemotecisQuery } =
  injectListEndpoint<IRemoteci>(resource);
export const { useUpdateRemoteciMutation } =
  injectUpdateEndpoint<IRemoteci>(resource);

export const {
  useSubscribeToARemoteciMutation,
  useUnsubscribeFromARemoteciMutation,
  useListSubscribedRemotecisQuery,
} = api
  .enhanceEndpoints({ addTagTypes: ["CurrentUserRemoteci"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      listSubscribedRemotecis: builder.query<
        {
          _meta: { count: number };
          remotecis: IRemoteci[];
        },
        ICurrentUser
      >({
        query: (currentUser) => `/users/${currentUser.id}/remotecis`,
        providesTags: [{ type: "CurrentUserRemoteci", id: "LIST" }],
      }),
      subscribeToARemoteci: builder.mutation<
        void,
        { currentUser: ICurrentUser; remoteci: IRemoteci }
      >({
        query({ currentUser, remoteci }) {
          return {
            url: `/remotecis/${remoteci.id}/users`,
            method: "POST",
            body: currentUser,
          };
        },
        invalidatesTags: ["CurrentUserRemoteci"],
      }),
      unsubscribeFromARemoteci: builder.mutation<
        { success: boolean; id: string },
        { currentUser: ICurrentUser; remoteci: IRemoteci }
      >({
        query({ currentUser, remoteci }) {
          return {
            url: `/remotecis/${remoteci.id}/users/${currentUser.id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["CurrentUserRemoteci"],
      }),
    }),
  });
