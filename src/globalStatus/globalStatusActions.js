import http from "services/http";
import * as constants from "./globalStatusActionsTypes";

export function getGlobalStatus() {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/global_status`
    };
    return http(request).then(response => {
      dispatch({
        type: constants.SET_GLOBAL_STATUS,
        globalStatus: response.data.globalStatus
      });
      return response;
    });
  };
}
