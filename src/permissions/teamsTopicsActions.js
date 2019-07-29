import http from "services/http";
import { showAPIError, showSuccess, showWarning } from "alerts/alertsActions";
import topicsActions from "topics/topicsActions";

export function associateTopicToTeam(topic, team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}/teams`,
      data: { team_id: team.id }
    };
    return http(request)
      .then(response => {
        dispatch(
          showSuccess(
            `team ${team.name} can now download all components from ${topic.name}`
          )
        );
        dispatch(topicsActions.one(topic, { embed: "teams" }));
      })
      .catch(error => {
        dispatch(showAPIError(error));
        throw error;
      });
  };
}

export function removeTopicFromTeam(topic, team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}/teams/${team.id}`,
      headers: { "If-Match": team.etag }
    };
    return http(request)
      .then(response => {
        dispatch(
          showWarning(
            `team ${team.name} can't download components from ${topic.name} anymore`
          )
        );
        dispatch(topicsActions.one(topic, { embed: "teams" }));
      })
      .catch(error => {
        dispatch(showAPIError(error));
        throw error;
      });
  };
}
