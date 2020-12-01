import http from "services/http";
import { createActions } from "api/apiActions";
import { AppThunk } from "store";
import { AxiosPromise } from "axios";
import { ITeam, IUser } from "types";

export default createActions("user");

interface IFetchUserTeams {
  teams: ITeam[];
}

export function fetchUserTeams(
  user: IUser
): AppThunk<AxiosPromise<IFetchUserTeams>> {
  return (dispatch, getState) => {
    const state = getState();
    return http.get(`${state.config.apiURL}/api/v1/users/${user.id}/teams`);
  };
}

export function addUserToTeam(
  user: IUser,
  team: ITeam
): AppThunk<AxiosPromise<void>> {
  return (dispatch, getState) => {
    const state = getState();
    return http.post(
      `${state.config.apiURL}/api/v1/teams/${team.id}/users/${user.id}`,
      {}
    );
  };
}

export function deleteUserFromTeam(
  user: IUser,
  team: ITeam
): AppThunk<AxiosPromise<void>> {
  return (dispatch, getState) => {
    const state = getState();
    return http.delete(
      `${state.config.apiURL}/api/v1/teams/${team.id}/users/${user.id}`
    );
  };
}
