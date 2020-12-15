import http from "services/http";
import { createActions } from "api/apiActions";
import { AxiosPromise } from "axios";
import { AppThunk } from "store";
import { ITeam, IUser } from "types";

export default createActions("team");

interface IFetchUsersForTeam {
  users: IUser[];
}

// todo remove app thunk
export function fetchUsersForTeam(
  team: ITeam
): AppThunk<AxiosPromise<IFetchUsersForTeam>> {
  return () => {
    return http.get(`/api/v1/teams/${team.id}/users`);
  };
}
