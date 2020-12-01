import http from "services/http";
import * as types from "./currentUserActionsTypes";
import {
  showAPIError,
  showError,
  showSuccess,
  showWarning,
} from "alerts/alertsActions";
import { ICurrentUser, IRemoteci, IUser } from "types";
import { AppThunk } from "store";
import { AxiosPromise } from "axios";

export function setIdentity(identity: ICurrentUser) {
  return {
    type: types.SET_IDENTITY,
    identity,
  };
}

interface IUpdateCurrentUser {
  user: IUser;
}

export function updateCurrentUser(
  currentUser: ICurrentUser
): AppThunk<AxiosPromise<IUpdateCurrentUser>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "put",
      url: `${state.config.apiURL}/api/v1/identity`,
      data: currentUser,
      headers: { "If-Match": currentUser.etag },
    })
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
        return error;
      });
  };
}

export function deleteCurrentUser() {
  return {
    type: types.DELETE_CURRENT_USER,
  };
}

interface IGetSubscribedRemotecis {
  remotecis: IRemoteci[];
}

export function getSubscribedRemotecis(
  identity: ICurrentUser
): AppThunk<AxiosPromise<IGetSubscribedRemotecis>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/users/${identity.id}/remotecis`,
    }).catch((error) => {
      dispatch(showError(`Cannot get subscribed remotecis`));
      return error;
    });
  };
}

export function subscribeToARemoteci(
  remoteci: IRemoteci,
  currentUser: ICurrentUser
): AppThunk<AxiosPromise<void>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "post",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users`,
      data: currentUser,
    })
      .then((response) => {
        dispatch(
          showSuccess(`You are subscribed to the remoteci ${remoteci.name}`)
        );
        return response;
      })
      .catch((error) => {
        dispatch(showError(`Cannot subscribe to remoteci ${remoteci.name}`));
        return error;
      });
  };
}

export function unsubscribeFromARemoteci(
  remoteci: IRemoteci,
  currentUser: ICurrentUser
): AppThunk<AxiosPromise<void>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "delete",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users/${currentUser.id}`,
    })
      .then((response) => {
        dispatch(
          showWarning(
            `You will no longer receive notification for the remoteci ${remoteci.name}`
          )
        );
        return response;
      })
      .catch((error) => {
        dispatch(showError(`Cannot unsubscribe to remoteci ${remoteci.name}`));
        return error;
      });
  };
}
