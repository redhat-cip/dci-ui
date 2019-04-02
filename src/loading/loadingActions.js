import * as types from "./loadingActionsTypes";

export function showLoading() {
  return {
    type: types.LOADING_STARTED
  };
}

export function hideLoading() {
  return {
    type: types.LOADING_STOPPED
  };
}
