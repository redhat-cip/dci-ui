import http from "services/http";
import { createActions } from "api/apiActions";
import { AxiosPromise } from "axios";
import { INewTeam, ITeam, IUser } from "types";

export default createActions("team");

interface IFetchUsersForTeam {
  users: IUser[];
}

export function fetchUsersForTeam(
  team: ITeam,
): AxiosPromise<IFetchUsersForTeam> {
  return http.get(`/api/v1/teams/${team.id}/users`);
}

export function searchTeam(name: string): AxiosPromise<{
  teams: ITeam[];
}> {
  return http.get(`/api/v1/teams/?where=name:${name}`);
}

export function getOrCreateTeam(team: INewTeam) {
  return searchTeam(team.name).then((response) => {
    if (response.data.teams.length > 0) {
      return response.data.teams[0];
    } else {
      return http({
        method: "post",
        url: `/api/v1/teams`,
        data: team,
      }).then((response) => response.data.team as ITeam);
    }
  });
}
