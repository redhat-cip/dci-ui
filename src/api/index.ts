import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../services/localStorage";
import { Filters } from "types";
import { createSearchFromFilters } from "./filters";

const baseUrl =
  process.env.REACT_APP_BACKEND_HOST || "https://api.distributed-ci.io";

export const Api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("authorization", `${token.type} ${token.value}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
});

type Resource =
  | "Job"
  | "Remoteci"
  | "Product"
  | "Topic"
  | "Component"
  | "Team"
  | "User"
  | "Feeder";

export const injectListEndpoint = <T extends { id: string }>(
  resourceName: Resource,
) => {
  const route = `${resourceName.toLowerCase()}s`;
  const enhancedApi = Api.enhanceEndpoints({ addTagTypes: [resourceName] });
  interface Api<T> {
    [route: string]: T[];
  }
  type ListResponse<T> = Api<T> & {
    _meta: { count: number };
  };
  const entityApi = enhancedApi.injectEndpoints({
    endpoints: (builder) => ({
      [`list${resourceName}s`]: builder.query<
        ListResponse<T>,
        Partial<Filters> | void
      >({
        query: (filters) => {
          if (filters) {
            return `/${route}${createSearchFromFilters(filters)}`;
          }
          return `/${route}`;
        },
        providesTags: (result) =>
          result
            ? [
                ...result[route].map(
                  ({ id }) => ({ type: resourceName, id }) as const,
                ),
                { type: resourceName, id: "LIST" },
              ]
            : [{ type: resourceName, id: "LIST" }],
      }),
    }),
  });
  return entityApi;
};

export const injectCreateEndpoint = <T extends { id: string }>(
  resourceName: Resource,
) => {
  const resourceNameLowercase = resourceName.toLowerCase();
  const route = `${resourceNameLowercase}s`;
  const enhancedApi = Api.enhanceEndpoints({ addTagTypes: [resourceName] });
  interface ApiGet<T> {
    [resourceNameLowercase: string]: T;
  }
  const entityApi = enhancedApi.injectEndpoints({
    endpoints: (builder) => ({
      [`create${resourceName}`]: builder.mutation<T, Partial<T>>({
        query(body) {
          return {
            url: `/${route}`,
            method: "POST",
            body,
          };
        },
        invalidatesTags: [{ type: resourceName, id: "LIST" }],
        transformResponse: (response: ApiGet<T>, meta, arg) =>
          response[resourceNameLowercase],
      }),
    }),
  });
  return entityApi;
};

export const injectGetEndpoint = <T extends { id: string }>(
  resourceName: Resource,
) => {
  const resourceNameLowercase = resourceName.toLowerCase();
  const route = `${resourceNameLowercase}s`;
  interface ApiGet<T> {
    [resourceNameLowercase: string]: T;
  }
  const enhancedApi = Api.enhanceEndpoints({ addTagTypes: [resourceName] });
  const entityApi = enhancedApi.injectEndpoints({
    endpoints: (builder) => ({
      [`get${resourceName}`]: builder.query<T, string | null>({
        query: (id) => `/${route}/${id}`,
        providesTags: (result, error, id) =>
          id === null ? [] : [{ type: resourceName, id }],
        transformResponse: (response: ApiGet<T>, meta, arg) =>
          response[resourceNameLowercase],
      }),
    }),
  });
  return entityApi;
};

export const injectUpdateEndpoint = <T extends { id: string; etag: string }>(
  resourceName: Resource,
) => {
  const route = `${resourceName.toLowerCase()}s`;
  const enhancedApi = Api.enhanceEndpoints({ addTagTypes: [resourceName] });
  const entityApi = enhancedApi.injectEndpoints({
    endpoints: (builder) => ({
      [`update${resourceName}`]: builder.mutation<T, Partial<T>>({
        query(data) {
          const { id, etag, ...body } = data;
          return {
            url: `/${route}/${id}`,
            headers: { "If-Match": etag },
            method: "PUT",
            body,
          };
        },
        invalidatesTags: (result, error, { id }) => [
          { type: resourceName, id },
        ],
      }),
    }),
  });
  return entityApi;
};

export const injectDeleteEndpoint = <T extends { id: string; etag: string }>(
  resourceName: Resource,
) => {
  const route = `${resourceName.toLowerCase()}s`;
  const enhancedApi = Api.enhanceEndpoints({ addTagTypes: [resourceName] });
  const entityApi = enhancedApi.injectEndpoints({
    endpoints: (builder) => ({
      [`delete${resourceName}`]: builder.mutation<
        { success: boolean; id: string },
        T
      >({
        query(data) {
          const { id, etag } = data;
          return {
            url: `/${route}/${id}`,
            headers: { "If-Match": etag },
            method: "DELETE",
          };
        },
        invalidatesTags: [{ type: resourceName, id: "LIST" }],
      }),
    }),
  });
  return entityApi;
};

export default Api;
