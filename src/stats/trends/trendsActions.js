import http from "services/http";
import * as types from "./trendsActionsTypes";

export function getTrends() {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/trends/topics`,
    };
    return http(request).then((response) => {
      dispatch({
        type: types.SET_TRENDS,
        trends: response.data.topics,
      });
      return response;
    });
  };
}
