import { AxiosPromise } from "axios";
import http from "services/http";
import { IJob, IFile, IGetTestsCases, IGetTestsResults } from "types";

export function getResults(job: IJob): AxiosPromise<IGetTestsResults> {
  return http({
    method: "get",
    url: `/api/v1/jobs/${job.id}/results`,
  });
}

export function getTestsCases(file: IFile): AxiosPromise<IGetTestsCases> {
  return http.request({
    method: "get",
    url: `/api/v1/files/${file.id}/testscases`,
  });
}
