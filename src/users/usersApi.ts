import {
  injectCreateEndpoint,
  injectDeleteEndpoint,
  injectGetEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
  api,
} from "api";
import type { ITeam, IUser } from "../types";

const resource = "User";

export const { useCreateUserMutation } = injectCreateEndpoint<IUser>(resource);
export const { useDeleteUserMutation } = injectDeleteEndpoint<IUser>(resource);
export const { useGetUserQuery } = injectGetEndpoint<IUser>(resource);
export const { useListUsersQuery } = injectListEndpoint<IUser>(resource);
export const { useUpdateUserMutation } = injectUpdateEndpoint<IUser>(resource);
export const { useLazySearchUserQuery } = api.injectEndpoints({
  endpoints: (build) => ({
    searchUser: build.query<{ users: IUser[] }, string>({
      query: (email: string) => `users/?where=email:${email}`,
    }),
  }),
});

export const {
  useAddUserToTeamMutation,
  useRemoveUserFromTeamMutation,
  useListUserTeamsQuery,
  useListTeamsUserQuery,
} = api.enhanceEndpoints({ addTagTypes: ["UserTeam"] }).injectEndpoints({
  endpoints: (builder) => ({
    listUserTeams: builder.query<
      {
        _meta: { count: number };
        teams: ITeam[];
      },
      IUser
    >({
      query: (user) => `/users/${user.id}/teams`,
      providesTags: [{ type: "UserTeam", id: "LIST" }],
    }),
    listTeamsUser: builder.query<
      {
        _meta: { count: number };
        users: IUser[];
      },
      ITeam
    >({
      query: (team) => `/teams/${team.id}/users`,
      providesTags: [{ type: "UserTeam", id: "LIST" }],
    }),
    addUserToTeam: builder.mutation<void, { user: IUser; team: ITeam }>({
      query({ user, team }) {
        return {
          url: `/teams/${team.id}/users/${user.id}`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["UserTeam"],
    }),
    removeUserFromTeam: builder.mutation<
      { success: boolean; id: string },
      { user: IUser; team: ITeam }
    >({
      query({ user, team }) {
        return {
          url: `/teams/${team.id}/users/${user.id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["UserTeam"],
    }),
  }),
});
