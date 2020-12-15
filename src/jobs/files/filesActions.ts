import http from "services/http";
import { AppThunk } from "store";
import { IFile } from "types";

export function getFileContent(
  file: IFile,
  params = {}
): AppThunk<Promise<string>> {
  return (dispatch, getState) => {
    const state = getState();
    return http
      .request({
        method: "get",
        url: `${state.config.apiURL}/api/v1/files/${file.id}/content`,
        ...params,
      })
      .then((response) => {
        if (typeof response.data === "object") {
          return JSON.stringify(response.data, null, 2);
        } else {
          return response.data;
        }
      });
  };
}
