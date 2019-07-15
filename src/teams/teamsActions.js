import http from "services/http";
import { createActions } from "api/apiActions";

export default createActions("team");

export function fetchUsersForTeam(team) {
  return (dispatch, getState) => {
    const state = getState();
    return http.get(`${state.config.apiURL}/api/v1/teams/${team.id}/users`);
  };
}
