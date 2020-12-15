import { AxiosPromise } from "axios";
import http from "services/http";
import { AppThunk } from "store";
import { IJob, IFile, IGetTestsCases, IGetTestsResults } from "types";

// todo remove app thunk
export function getResults(
  job: IJob
): AppThunk<AxiosPromise<IGetTestsResults>> {
  return () => {
    return http({
      method: "get",
      url: `/api/v1/jobs/${job.id}/results`,
    });
  };
}

// todo remove app thunk
export function getTestsCases(
  file: IFile
): AppThunk<AxiosPromise<IGetTestsCases>> {
  return () => {
    return http.request({
      method: "get",
      url: `/api/v1/files/${file.id}/testscases`,
    });
  };
}
