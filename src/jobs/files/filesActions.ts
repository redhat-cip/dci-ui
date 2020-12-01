import { AxiosPromise } from "axios";
import http from "services/http";
import { AppThunk } from "store";
import { IFile } from "types";

export function getFileContent(
  file: IFile,
  params = {}
): AppThunk<AxiosPromise<string>> {
  return (dispatch, getState) => {
    const state = getState();
    return http.request({
      method: "get",
      url: `${state.config.apiURL}/api/v1/files/${file.id}/content`,
      ...params,
    });
  };
}
