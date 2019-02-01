import http from "../../services/http";

export function getResults(job) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/results`
    });
  };
}

export function getTestsCases(file) {
  return (dispatch, getState) => {
    const state = getState();
    return http.request({
      method: "get",
      url: `${state.config.apiURL}/api/v1/files/${file.id}/testscases`
    });
  };
}
