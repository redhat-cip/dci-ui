import http from "services/http";
import * as types from "./currentUserActionsTypes";
import {
  showAPIError,
  showError,
  showSuccess,
  showWarning,
} from "alerts/alertsActions";

export function setIdentity(identity) {
  return {
    type: types.SET_IDENTITY,
    identity,
  };
}

export function updateCurrentUser(currentUser) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "put",
      url: `${state.config.apiURL}/api/v1/identity`,
      data: currentUser,
      headers: { "If-Match": currentUser.etag },
    };
    return http(request)
      .then((response) => {
        dispatch({
          type: types.UPDATE_CURRENT_USER,
          currentUser: response.data.user,
        });
        dispatch(showSuccess("Your settings has been updated successfully"));
        return response;
      })
      .catch((error) => {
        dispatch(showAPIError(error));
      });
  };
}

export function deleteCurrentUser() {
  return {
    type: types.DELETE_CURRENT_USER,
  };
}

export function getSubscribedRemotecis(identity) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/users/${identity.id}/remotecis`,
    };
    return http(request)
      .then((response) => {
        dispatch({
          type: types.SET_IDENTITY,
          identity: {
            ...identity,
            remotecis: response.data.remotecis,
          },
        });
        return response;
      })
      .catch(() => dispatch(showError(`Cannot get subscribed remotecis`)));
  };
}

export function subscribeToARemoteci(remoteci) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users`,
      data: state.currentUser,
    };
    return http(request)
      .then((response) => {
        dispatch({
          type: types.SUBSCRIBED_TO_A_REMOTECI,
          remoteci,
        });
        dispatch(
          showSuccess(`You are subscribed to the remoteci ${remoteci.name}`)
        );
        return response;
      })
      .catch(() =>
        dispatch(showError(`Cannot subscribe to remoteci ${remoteci.name}`))
      );
  };
}

export function unsubscribeFromARemoteci(remoteci) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users/${state.currentUser.id}`,
    };
    return http(request)
      .then((response) => {
        dispatch({
          type: types.UNSUBSCRIBED_FROM_A_REMOTECI,
          remoteci,
        });
        dispatch(
          showWarning(
            `You will no longer receive notification for the remoteci ${remoteci.name}`
          )
        );
        return response;
      })
      .catch(() =>
        dispatch(showError(`Cannot unsubscribe to remoteci ${remoteci.name}`))
      );
  };
}
