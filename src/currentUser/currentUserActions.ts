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
  return (dispatch) => {
    return http({
      method: "put",
      url: "/api/v1/identity",
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
  return (dispatch) => {
    return http({
      method: "get",
      url: `/api/v1/users/${identity.id}/remotecis`,
    }).catch((error) => {
      dispatch(showError(`Cannot get subscribed remotecis`));
      return error;
    });
  };
}

export function subscribeToARemoteci(
  remoteci_id: string,
  currentUser: ICurrentUser
): AppThunk<AxiosPromise<void>> {
  return (dispatch) => {
    return http({
      method: "post",
      url: `/api/v1/remotecis/${remoteci_id}/users`,
      data: currentUser,
    })
      .then((response) => {
        dispatch(showSuccess("You are successfully subscribed"));
        return response;
      })
      .catch((error) => {
        dispatch(showError("Cannot subscribe to remoteci"));
        return error;
      });
  };
}

export function unsubscribeFromARemoteci(
  remoteci_id: string,
  currentUser: ICurrentUser
): AppThunk<AxiosPromise<void>> {
  return (dispatch) => {
    return http({
      method: "delete",
      url: `/api/v1/remotecis/${remoteci_id}/users/${currentUser.id}`,
    })
      .then((response) => {
        dispatch(
          showWarning(
            "You will no longer receive notification for this remoteci"
          )
        );
        return response;
      })
      .catch((error) => {
        dispatch(showError("Cannot unsubscribe from this remoteci"));
        return error;
      });
  };
}
