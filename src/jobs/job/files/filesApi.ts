import { api, baseUrl } from "api";
import { getToken } from "services/localStorage";
import type { IFile } from "types";

export const { useGetFileContentQuery, useLazyGetFileContentQuery } = api
  .enhanceEndpoints({ addTagTypes: ["File"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getFileContent: builder.query<string, IFile>({
        query: (id) => ({
          url: `/files/${id}/content`,
          method: "GET",
          responseHandler: "text",
        }),
      }),
    }),
  });

export async function getFileContentAsBlob(file: IFile) {
  const token = getToken();
  const headers = new Headers();
  if (token) {
    headers.append("Authorization", `${token.type} ${token.value}`);
  }
  const response = await fetch(`${baseUrl}/api/v1/files/${file.id}/content`, {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    throw new Error(`Error fetching file content: ${response.statusText}`);
  }
  return await response.blob();
}
