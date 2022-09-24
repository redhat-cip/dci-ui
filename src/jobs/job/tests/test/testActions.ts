import { AxiosPromise } from "axios";
import http from "services/http";
import { IFile, IGetJunitTestSuites } from "types";

export function getJunit(file: IFile): AxiosPromise<IGetJunitTestSuites> {
  return http.request({
    method: "get",
    url: `/api/v1/files/${file.id}/junit`,
  });
}
