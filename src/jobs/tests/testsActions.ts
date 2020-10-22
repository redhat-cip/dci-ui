import { AxiosPromise } from "axios";
import http from "services/http";
import { AppThunk } from "store";
import { IJob, IFile, IGetTestsCases, IGetTestsResults } from "types";

export function getResults(
  job: IJob
): AppThunk<AxiosPromise<IGetTestsResults>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/results`,
    });
  };
}

export function getTestsCases(
  file: IFile
): AppThunk<AxiosPromise<IGetTestsCases>> {
  return (dispatch, getState) => {
    const state = getState();
    return http.request({
      method: "get",
      url: `${state.config.apiURL}/api/v1/files/${file.id}/testscases`,
    });
  };
}
