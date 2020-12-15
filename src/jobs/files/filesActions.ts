import http from "services/http";
import { AppThunk } from "store";
import { IFile } from "types";

// todo remove app thunk
export function getFileContent(
  file: IFile,
  params = {}
): AppThunk<Promise<string>> {
  return () => {
    return http
      .request({
        method: "get",
        url: `/api/v1/files/${file.id}/content`,
        ...params,
      })
      .then((response) => {
        if (
          typeof response.data === "object" &&
          file.mime === "application/x-ansible-output"
        ) {
          return JSON.stringify(response.data, null, 2);
        } else {
          return response.data;
        }
      });
  };
}
