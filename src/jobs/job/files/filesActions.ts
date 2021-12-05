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
      const content = response.data;
      if (
        typeof content === "object" &&
        response.config.responseType !== "blob"
      ) {
        try {
          return JSON.stringify(content, null, 2);
        } catch (error) {}
      }
      return response.data;
    });
}
