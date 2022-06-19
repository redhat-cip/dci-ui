import http from "services/http";
import * as types from "./currentUserActionsTypes";
import { showAPIError, showSuccess } from "alerts/alertsActions";
import { ICurrentUser, IRemoteci, ITopic, IUser } from "types";
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
): AxiosPromise<IGetSubscribedRemotecis> {
  return http({
    method: "get",
    url: `/api/v1/users/${identity.id}/remotecis`,
  });
}

export function subscribeToARemoteci(
  remoteciId: string,
  currentUser: ICurrentUser
): AxiosPromise<void> {
  return http({
    method: "post",
    url: `/api/v1/remotecis/${remoteciId}/users`,
    data: currentUser,
  });
}

export function unsubscribeFromARemoteci(
  remoteciId: string,
  currentUser: ICurrentUser
): AxiosPromise<void> {
  return http({
    method: "delete",
    url: `/api/v1/remotecis/${remoteciId}/users/${currentUser.id}`,
  });
}

interface IGetSubscribedTopics {
  topics: ITopic[];
}

export function getSubscribedTopics(): AxiosPromise<IGetSubscribedTopics> {
  return http({
    method: "get",
    url: `/api/v1/topics/notifications`,
  });
}

export function subscribeToATopic(topicId: string): AxiosPromise<void> {
  return http({
    method: "post",
    url: `/api/v1/topics/${topicId}/notifications`,
  });
}

export function unsubscribeFromATopic(topicId: string): AxiosPromise<void> {
  return http({
    method: "delete",
    url: `/api/v1/topics/${topicId}/notifications`,
  });
}
