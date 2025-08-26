import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { api } from "api";
import { createSearchParams } from "react-router";
import type {
  AnalyticsToolbarSearch,
  IAnalyticsJob,
  IAnalyticsKeysValuesJob,
  IAnalyticsResultsJob,
  IAnalyticsTestsJob,
  IGenericAnalyticsData,
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";

export function createAnalyticsSearchParams(
  obj: Record<string, string | string[] | number | null>,
) {
  return createSearchParams(
    Object.entries(obj).reduce(
      (acc, [key, value]) => {
        if (value instanceof Array && value.length === 0) {
          return acc;
        }
        if (value !== null && value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  ).toString();
}

async function getAllAnalyticsJobs<T>(
  args: {
    query: string;
    after: string;
    before: string;
    includes: string;
  },
  fetchWithBQ: (arg: Parameters<BaseQueryFn>[0]) => ReturnType<BaseQueryFn>,
) {
  const { query, after, before, includes } = args;
  let offset = 0;
  const limit = 200;
  const analyticsJobs: IGenericAnalyticsData<T> = {
    jobs: [],
    _meta: { first_sync_date: "", last_sync_date: "", total: 0 },
  };
  let total = Infinity;

  try {
    while (offset < total) {
      const params = createAnalyticsSearchParams({
        query,
        offset,
        limit,
        sort: "-created_at",
        includes,
        from: after,
        to: before,
      });

      const response = await fetchWithBQ(`/analytics/jobs?${params}`);
      if (response.error) {
        return { error: response.error as FetchBaseQueryError };
      }

      const data = response.data as
        | IGetAnalyticsJobsResponse<T>
        | IGetAnalyticsJobsEmptyResponse;

      analyticsJobs._meta.first_sync_date = data._meta.first_sync_date;
      analyticsJobs._meta.last_sync_date = data._meta.last_sync_date;
      if (!("hits" in data)) break;
      const nbOfJobs = data.hits.total.value;
      analyticsJobs._meta.total = nbOfJobs;
      analyticsJobs.jobs = [
        ...analyticsJobs.jobs,
        ...data.hits.hits.map((h) => h._source),
      ];
      total = nbOfJobs;
      offset += limit;
    }
    return {
      data: analyticsJobs,
    };
  } catch (error) {
    return { error: error as FetchBaseQueryError };
  }
}

async function getAnalyticsJobs<T>(
  args: AnalyticsToolbarSearch & {
    includes: string;
    sort?: string;
  },
  fetchWithBQ: (arg: Parameters<BaseQueryFn>[0]) => ReturnType<BaseQueryFn>,
) {
  const {
    query,
    after,
    before,
    includes,
    offset = 0,
    limit = 200,
    sort = "-created_at",
  } = args;

  const analyticsJobs: IGenericAnalyticsData<T> = {
    jobs: [],
    _meta: { first_sync_date: "", last_sync_date: "", total: 0 },
  };

  try {
    const params = createAnalyticsSearchParams({
      query,
      offset,
      limit,
      sort,
      includes,
      from: after,
      to: before,
    });

    const response = await fetchWithBQ(`/analytics/jobs?${params}`);
    if (response.error) {
      return { error: response.error as FetchBaseQueryError };
    }

    const data = response.data as
      | IGetAnalyticsJobsResponse<T>
      | IGetAnalyticsJobsEmptyResponse;
    analyticsJobs._meta.first_sync_date = data._meta.first_sync_date;
    analyticsJobs._meta.last_sync_date = data._meta.last_sync_date;
    if ("hits" in data) {
      analyticsJobs._meta.total = data.hits.total.value;
      analyticsJobs.jobs = [...data.hits.hits.map((h) => h._source)];
    }
    return {
      data: analyticsJobs,
    };
  } catch (error) {
    return { error: error as FetchBaseQueryError };
  }
}
const genericIncludes =
  "id,name,status,created_at,duration,configuration,url,status_reason,comment,pipeline.id,pipeline.created_at,pipeline.name,team.id,team.name,topic.name,components.id,components.topic_id,components.display_name,components.type,remoteci.name,tags";

export const {
  useLazyGetAnalyticsResultsJobsQuery,
  useLazyGetAnalyticJobsQuery,
  useLazyGetAnalyticsKeysValuesJobsQuery,
  useLazyGetAnalyticsTestsJobsQuery,
  useLazyGetSuggestionsQuery,
} = api.enhanceEndpoints({ addTagTypes: ["Analytics"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticJobs: builder.query<
      IGenericAnalyticsData<IAnalyticsJob>,
      AnalyticsToolbarSearch
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        return getAllAnalyticsJobs<IAnalyticsJob>(
          {
            ...arg,
            includes: genericIncludes,
          },
          fetchWithBQ,
        );
      },
      providesTags: ["Analytics"],
    }),
    getAnalyticsKeysValuesJobs: builder.query<
      IGenericAnalyticsData<IAnalyticsKeysValuesJob>,
      AnalyticsToolbarSearch
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        return getAllAnalyticsJobs<IAnalyticsKeysValuesJob>(
          {
            ...arg,
            includes: `${genericIncludes},keys_values`,
          },
          fetchWithBQ,
        );
      },
      providesTags: ["Analytics"],
    }),
    getAnalyticsResultsJobs: builder.query<
      IGenericAnalyticsData<IAnalyticsResultsJob>,
      AnalyticsToolbarSearch
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        return getAllAnalyticsJobs<IAnalyticsResultsJob>(
          {
            ...arg,
            includes: `${genericIncludes},results.errors,results.failures,results.success,results.failures,results.skips,results.total`,
          },
          fetchWithBQ,
        );
      },
      providesTags: ["Analytics"],
    }),
    getAnalyticsTestsJobs: builder.query<
      IGenericAnalyticsData<IAnalyticsTestsJob>,
      AnalyticsToolbarSearch
    >({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        return getAnalyticsJobs<IAnalyticsTestsJob>(
          {
            ...arg,
            includes: `${genericIncludes},tests.file_id,tests.name,tests.testsuites.name,tests.testsuites.testcases.name,tests.testsuites.testcases.action,tests.testsuites.testcases.classname`,
          },
          fetchWithBQ,
        );
      },
      providesTags: ["Analytics"],
    }),
    getSuggestions: builder.query<string[], string>({
      async queryFn(fieldName, _queryApi, _extraOptions, fetchWithBQ) {
        const response = await fetchWithBQ(
          `/analytics/jobs/autocomplete?field=${fieldName}`,
        );
        if (response.error) {
          return { error: response.error as FetchBaseQueryError };
        }
        const data = response.data as string[];
        return { data };
      },
      providesTags: ["Analytics"],
    }),
  }),
});
