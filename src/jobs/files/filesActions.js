import http from "services/http";

export function getFileContent(file, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    return http.request({
      method: "get",
      url: `${state.config.apiURL}/api/v1/files/${file.id}/content`,
      ...params,
    });
  };
}
