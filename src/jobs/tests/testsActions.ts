import { AxiosPromise } from "axios";
import http from "services/http";
import { AppThunk } from "store";
import { IJob, ITest, ITestsCase } from "types";

interface ITests {
  results: ITest[];
}

export function getResults(job: IJob): AppThunk<AxiosPromise<ITests>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/results`,
    });
  };
}

interface IFile {
  id: string;
}

interface ITestsCases {
  testscases: ITestsCase[];
}

export function getTestsCases(
  file: IFile
): AppThunk<AxiosPromise<ITestsCases>> {
  return (dispatch, getState) => {
    const state = getState();
    return http.request({
      method: "get",
      url: `${state.config.apiURL}/api/v1/files/${file.id}/testscases`,
    });
  };
}
