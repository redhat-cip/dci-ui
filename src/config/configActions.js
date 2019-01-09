import http from "../services/http";
import * as types from "./configActionsTypes";

export function setConfig(config) {
  return {
    type: types.SET_CONFIG,
    config
  };
}

export function getConfig() {
  return dispatch => {
    return http.get("config.json").then(response => {
      const config = response.data;
      dispatch(setConfig(config));
      return config;
    });
  };
}
