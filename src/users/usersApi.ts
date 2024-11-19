import { AxiosPromise } from "axios";
import http from "services/http";
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

export const {
  useAddUserToTeamMutation,
  useRemoveUserFromTeamMutation,
  useListUserTeamsQuery,
} = api
  .enhanceEndpoints({
    addTagTypes: ["UserTeam"],
  })
  .injectEndpoints({
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

export function fetchUserTeams(user: IUser): AxiosPromise<{
  teams: ITeam[];
}> {
  return http.get(`/api/v1/users/${user.id}/teams`);
}

export function getOrCreateUser(user: Partial<IUser>) {
  return searchUserBy("sso_username", user.sso_username || "").then(
    (response) => {
      if (response.data.users.length > 0) {
        return response.data.users[0];
      } else {
        return http({
          method: "post",
          url: `/api/v1/users`,
          data: user,
        }).then((response) => response.data.user as IUser);
      }
    },
  );
}

export function searchUserBy(
  key: "email" | "name" | "sso_username",
  value: string,
): AxiosPromise<{
  users: IUser[];
}> {
  return http.get(`/api/v1/users/?where=${key}:${value}`);
}

export function addUserToTeam(
  user_id: string,
  team: ITeam,
): AxiosPromise<void> {
  return http.post(`/api/v1/teams/${team.id}/users/${user_id}`, {});
}

export function deleteUserFromTeam(
  user: IUser,
  team: ITeam,
): AxiosPromise<void> {
  return http.delete(`/api/v1/teams/${team.id}/users/${user.id}`);
}
