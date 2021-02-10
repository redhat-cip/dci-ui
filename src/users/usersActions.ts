import http from "services/http";
import { createActions } from "api/apiActions";
import { AppThunk } from "store";
import { AxiosPromise } from "axios";
import { ITeam, IUser } from "types";

export default createActions("user");

interface IFetchUserTeams {
  teams: ITeam[];
}

export function fetchUserTeams(user: IUser): AxiosPromise<IFetchUserTeams> {
  return http.get(`/api/v1/users/${user.id}/teams`);
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
