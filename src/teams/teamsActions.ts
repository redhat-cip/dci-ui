import http from "services/http";
import { createActions } from "api/apiActions";
import { AxiosPromise } from "axios";
import { AppThunk } from "store";
import { ITeam, IUser } from "types";

export default createActions("team");

interface IFetchUsersForTeam {
  users: IUser[];
}

export function fetchUsersForTeam(
  team: ITeam
): AppThunk<AxiosPromise<IFetchUsersForTeam>> {
  return (dispatch, getState) => {
    const state = getState();
    return http.get(`${state.config.apiURL}/api/v1/teams/${team.id}/users`);
  };
}
