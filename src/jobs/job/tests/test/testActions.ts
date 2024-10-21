import { AxiosPromise } from "axios";
import http from "services/http";
import { IGetFile, IGetJunitTestSuites } from "types";

export function getFile(id: string): AxiosPromise<IGetFile> {
  return http.request({
    method: "get",
    url: `/api/v1/files/${id}`,
  });
}

export function getJunit(file_id: string): AxiosPromise<IGetJunitTestSuites> {
  return http.request({
    method: "get",
    url: `/api/v1/files/${file_id}/junit`,
  });
}
