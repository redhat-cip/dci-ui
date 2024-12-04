import { api } from "api";
import { IGetJunitTestSuites } from "types";

export const { useGetJunitQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Tests", "File"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getJunit: builder.query<IGetJunitTestSuites, string>({
        query: (id) => `/files/${id}/junit`,
      }),
    }),
  });
