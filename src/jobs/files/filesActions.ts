import http from "services/http";
import { IFile } from "types";

export function getFileContent(file: IFile, params = {}): Promise<string> {
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
}
