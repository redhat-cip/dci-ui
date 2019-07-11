import { isFunction } from "lodash";
import http from "services/http";
import * as types from "./currentUserActionsTypes";
import {
  showAPIError,
  showError,
  showSuccess,
  showWarning
} from "alerts/alertsActions";
import { removeToken, getToken } from "services/localStorage";

export function getIdentity() {
  return (dispatch, getState) => {
    const state = getState();
    return http.get(`${state.config.apiURL}/api/v1/identity`).then(response => {
      const identity = response.data.identity;
      dispatch({
        type: types.SET_IDENTITY,
        identity
      });
      return response;
    });
  };
}

export function setCurrentTeam(team) {
  return {
    type: types.SET_ACTIVE_TEAM,
    team
  };
}

export function updateCurrentUser(currentUser) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "put",
      url: `${state.config.apiURL}/api/v1/identity`,
      data: currentUser,
      headers: { "If-Match": currentUser.etag }
    };
    return http(request)
      .then(response => {
        dispatch({
          type: types.UPDATE_CURRENT_USER,
          currentUser: response.data.user
        });
        dispatch(
          showSuccess(
            "Your information has been updated successfully. Log in again."
          )
        );
        dispatch(deleteCurrentUser());
        return response;
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
    if (token && token.type === "Bearer" && isFunction(window._sso.logout)) {
      window._sso.logout();
    }
    removeToken();
  };
}

export function getSubscribedRemotecis(identity) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/users/${identity.id}/remotecis`
    };
    return http(request)
      .then(response => {
        dispatch({
          type: types.SET_IDENTITY,
          identity: {
            ...identity,
            remotecis: response.data.remotecis
          }
        });
        return response;
      })
      .catch(error => {
        dispatch(showError(`Cannot get subscribed remotecis`));
        return Promise.resolve(error);
      });
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
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users/${state.currentUser.id}`
    };
    return http(request)
      .then(response => {
        dispatch({
          type: types.UNSUBSCRIBED_FROM_A_REMOTECI,
          remoteci
        });
        dispatch(
          showWarning(
            `You will no longer receive notification for the remoteci ${remoteci.name}`
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
