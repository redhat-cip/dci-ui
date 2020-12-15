import { AxiosPromise } from "axios";
import http from "services/http";
import { AppThunk } from "store";
import { IFile } from "types";

// todo remove app thunk
export function getFileContent(
  file: IFile,
  params = {}
): AppThunk<AxiosPromise<string>> {
  return () => {
    return http.request({
      method: "get",
      url: `/api/v1/files/${file.id}/content`,
      ...params,
    });
  };
}
