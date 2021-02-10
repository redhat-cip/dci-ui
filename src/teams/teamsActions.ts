import http from "services/http";
import { createActions } from "api/apiActions";
import { AxiosPromise } from "axios";
import { ITeam, IUser } from "types";

export default createActions("team");

interface IFetchUsersForTeam {
  users: IUser[];
}

export function fetchUsersForTeam(
  team: ITeam
): AxiosPromise<IFetchUsersForTeam> {
  return http.get(`/api/v1/teams/${team.id}/users`);
}
