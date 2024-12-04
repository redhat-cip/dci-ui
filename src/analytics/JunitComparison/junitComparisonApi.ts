import { api } from "api";

export type JunitComputationMode = "mean" | "median";

export interface JunitComparisonPayload {
  topic_1_id: string | null;
  topic_1_start_date: string | null;
  topic_1_end_date: string | null;
  remoteci_1_id: string | null;
  topic_1_baseline_computation: JunitComputationMode;
  tags_1: string[];
  topic_2_id: string | null;
  topic_2_start_date: string | null;
  topic_2_end_date: string | null;
  remoteci_2_id: string | null;
  topic_2_baseline_computation: JunitComputationMode;
  tags_2: string[];
  test_name: string | null;
}

interface JunitBarChartData {
  details: { testcase: string; value: number }[];
  intervals: number[];
  values: number[];
  len_jobs_topic_1: number;
  len_jobs_topic_2: number;
}

interface TrendPercentageData {
  job_ids: string[];
  values: number[];
}

export interface JunitData {
  bar_chart: JunitBarChartData;
  trend_percentage: TrendPercentageData;
  details: { testcase: string; value: number }[];
  intervals: number[];
  values: number[];
  len_jobs_topic_1: number;
  len_jobs_topic_2: number;
}

export const { useLazyGetJunitQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getJunit: builder.query<JunitData, JunitComparisonPayload>({
        query(body) {
          return {
            url: "/analytics/junit_comparison",
            method: "POST",
            body,
          };
        },
        transformResponse: (response: JunitData | undefined) => {
          if (typeof response === "object") {
            return response;
          } else {
            throw new Error(
              "JSON returned by the API for /api/v1/analytics/junit_comparison is not valid",
            );
          }
        },
        providesTags: ["Analytics"],
      }),
    }),
  });
