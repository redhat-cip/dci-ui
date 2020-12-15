import http from "services/http";
import { createActions } from "api/apiActions";
import { AppThunk } from "store";
import { AxiosPromise } from "axios";
import { ITeam, IUser } from "types";

export default createActions("user");

interface IFetchUserTeams {
  teams: ITeam[];
}

// todo remove app thunk
export function fetchUserTeams(
  user: IUser
): AppThunk<AxiosPromise<IFetchUserTeams>> {
  return () => {
    return http.get(`/api/v1/users/${user.id}/teams`);
  };
}

// todo remove app thunk
export function addUserToTeam(
  user_id: string,
  team: ITeam
): AppThunk<AxiosPromise<void>> {
  return () => {
    return http.post(`/api/v1/teams/${team.id}/users/${user_id}`, {});
  };
}

// todo remove app thunk
export function deleteUserFromTeam(
  user: IUser,
  team: ITeam
): AppThunk<AxiosPromise<void>> {
  return () => {
    return http.delete(`/api/v1/teams/${team.id}/users/${user.id}`);
  };
}
