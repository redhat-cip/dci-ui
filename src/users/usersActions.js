import http from "services/http";
import { createActions } from "api/apiActions";

export default createActions("user");

export function fetchUserTeams(user) {
  return (dispatch, getState) => {
    const state = getState();
    return http.get(`${state.config.apiURL}/api/v1/users/${user.id}/teams`);
  };
}

export function addUserToTeam(user, team) {
  return (dispatch, getState) => {
    const state = getState();
    return http.post(
      `${state.config.apiURL}/api/v1/teams/${team.id}/users/${user.id}`,
      {}
    );
  };
}

export function deleteUserFromTeam(user, team) {
  return (dispatch, getState) => {
    const state = getState();
    return http.delete(
      `${state.config.apiURL}/api/v1/teams/${team.id}/users/${user.id}`
    );
  };
}
