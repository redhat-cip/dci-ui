import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getToken, setJWT } from "services/localStorage";
import { Filters } from "types";
import { createSearchFromFilters } from "services/filters";
import { Mutex } from "async-mutex";
import { manager } from "auth/sso";
import { loggedOut } from "auth/authSlice";
import { getDefaultTeam } from "auth/authApi";

export const baseUrl =
  process.env.REACT_APP_BACKEND_HOST || "https://api.distributed-ci.io";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/api/v1`,
  prepareHeaders: (headers, { endpoint }) => {
    const token = getToken();
    if (token && !headers.has("authorization")) {
      headers.set("authorization", `${token.type} ${token.value}`);
    }
    headers.set("Content-Type", "application/json");
    const team = getDefaultTeam();
    if (team && endpoint !== "getCurrentUser") {
      headers.set("X-Dci-Team-Id", team.id);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  const token = getToken();
  if (result.error && result.error.status === 401 && token) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();
      try {
        let access_token;
        if (token.type === "Bearer") {
          const user = await manager.signinSilent();
          access_token = user?.access_token;
        }
        if (access_token) {
          setJWT(access_token);
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } catch (error) {
        api.dispatch(loggedOut());
      } finally {
        release();
      }
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
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
  interface Api<T> {
    [route: string]: T[];
  }
  type ListResponse<T> = Api<T> & {
    _meta: { count: number };
  };
  return api.enhanceEndpoints({ addTagTypes: [resourceName] }).injectEndpoints({
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
};

export const injectCreateEndpoint = <T extends { id: string }>(
  resourceName: Resource,
) => {
  const resourceNameLowercase = resourceName.toLowerCase();
  const route = `${resourceNameLowercase}s`;
  interface ApiGet<T> {
    [resourceNameLowercase: string]: T;
  }
  return api.enhanceEndpoints({ addTagTypes: [resourceName] }).injectEndpoints({
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
};

export const injectGetEndpoint = <T extends { id: string }>(
  resourceName: Resource,
) => {
  const resourceNameLowercase = resourceName.toLowerCase();
  const route = `${resourceNameLowercase}s`;
  interface ApiGet<T> {
    [resourceNameLowercase: string]: T;
  }
  return api.enhanceEndpoints({ addTagTypes: [resourceName] }).injectEndpoints({
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
};

export const injectUpdateEndpoint = <T extends { id: string; etag: string }>(
  resourceName: Resource,
) => {
  const route = `${resourceName.toLowerCase()}s`;
  return api.enhanceEndpoints({ addTagTypes: [resourceName] }).injectEndpoints({
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
};

export const injectDeleteEndpoint = <T extends { id: string; etag: string }>(
  resourceName: Resource,
) => {
  const route = `${resourceName.toLowerCase()}s`;
  return api.enhanceEndpoints({ addTagTypes: [resourceName] }).injectEndpoints({
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
};
