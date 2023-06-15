import http from "services/http";
import { createActions } from "api/apiActions";
import { AxiosPromise } from "axios";
import { INewUser, ITeam, IUser } from "types";

export default createActions("user");

interface IFetchUserTeams {
  teams: ITeam[];
}

export function fetchUserTeams(user: IUser): AxiosPromise<IFetchUserTeams> {
  return http.get(`/api/v1/users/${user.id}/teams`);
}

export function getOrCreateUser(sso_username: string) {
  return searchUserBy("sso_username", sso_username).then((response) => {
    if (response.data.users.length > 0) {
      return response.data.users[0];
    } else {
      return http({
        method: "post",
        url: `/api/v1/users`,
        data: { sso_username },
      }).then((response) => response.data.user as IUser);
    }
  });
}

export function addUserToTeam(
  user_id: string,
  team: ITeam
): AxiosPromise<void> {
  return http.post(`/api/v1/teams/${team.id}/users/${user_id}`, {});
}

export function deleteUserFromTeam(
  user: IUser,
  team: ITeam
): AxiosPromise<void> {
  return http.delete(`/api/v1/teams/${team.id}/users/${user.id}`);
}

export function searchUserBy(
  key: "email" | "name" | "sso_username",
  value: string
): AxiosPromise<{
  users: IUser[];
}> {
  return http.get(`/api/v1/users/?where=${key}:${value}`);
}
