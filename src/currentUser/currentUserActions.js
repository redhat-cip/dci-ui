import http from "../services/http";
import * as types from "./currentUserActionsTypes";
import {
  showAPIError,
  showError,
  showSuccess,
  showWarning
} from "../alerts/alertsActions";
import { removeToken, getToken } from "../services/localStorage";

export function getCurrentUser() {
  return (dispatch, getState) => {
    const state = getState();
    const params = {
      embed: "team,role,remotecis"
    };
    return http
      .get(`${state.config.apiURL}/api/v1/users/me`, { params })
      .then(response => {
        const currentUser = response.data.user;
        dispatch({
          type: types.SET_CURRENT_USER,
          currentUser
        });
        return currentUser;
      });
  };
}

export function updateCurrentUser(currentUser) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "put",
      url: `${state.config.apiURL}/api/v1/users/me`,
      data: currentUser,
      headers: { "If-Match": currentUser.etag }
    };
    return http(request)
      .then(response => {
        dispatch({
          type: types.UPDATE_CURRENT_USER,
          currentUser: response.data.user
        });
        dispatch(showSuccess("Your settings has been updated"));
      })
      .catch(error => {
        dispatch(showAPIError(error.response));
        throw error;
      });
  };
}

export function deleteCurrentUser() {
  return {
    type: types.DELETE_CURRENT_USER
  };
}

export function logout() {
  return dispatch => {
    dispatch(deleteCurrentUser());
    const token = getToken();
    if (token && token.type === "Bearer") {
      try {
        window._sso.logout();
      } catch (error) {
        console.error("Can't call keycloak logout");
      }
    }
    removeToken();
  };
}

export function subscribeToARemoteci(remoteci) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users`,
      data: state.currentUser
    };
    return http(request)
      .then(response => {
        dispatch({
          type: types.SUBSCRIBED_TO_A_REMOTECI,
          remoteci
        });
        dispatch(
          showSuccess(`You are subscribed to the remoteci ${remoteci.name}`)
        );
        return response;
      })
      .catch(error => {
        dispatch(showError(`Cannot subscribe to remoteci ${remoteci.name}`));
        return Promise.resolve(error);
      });
  };
}

export function unsubscribeFromARemoteci(remoteci) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users/${
        state.currentUser.id
      }`
    };
    return http(request)
      .then(response => {
        dispatch({
          type: types.UNSUBSCRIBED_FROM_A_REMOTECI,
          remoteci
        });
        dispatch(
          showWarning(
            `You will no longer receive notification for the remoteci ${
              remoteci.name
            }`
          )
        );
        return response;
      })
      .catch(error => {
        dispatch(showError(`Cannot unsubscribe to remoteci ${remoteci.name}`));
        return Promise.resolve(error);
      });
  };
}
