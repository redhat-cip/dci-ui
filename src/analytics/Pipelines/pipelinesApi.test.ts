import { DateTime } from "luxon";
import { extractPipelinesFromAnalyticsJobs } from "./pipelinesApi";
import { IGetAnalyticsJobsResponse } from "types";

test("extractPipelinesFromAnalyticsJobs", () => {
  expect(
    extractPipelinesFromAnalyticsJobs({
      _shards: { failed: 0, skipped: 0, successful: 1, total: 1 },
      hits: {
        hits: [
          {
            _id: "h1",
            _index: "jobs",
            _score: null,
            _source: {
              comment: "",
              components: [
                {
                  display_name: "python3-kubernetes 11.0.0-6.el8",
                  id: "c1",
                  topic_id: "t1",
                },
                {
                  display_name: "ansible 2.9.27-1.el8ae",
                  id: "c2",
                  topic_id: "t1",
                },
              ],
              created_at: "2024-12-04T14:46:24.840989",
              duration: 905,
              id: "j1",
              name: "test-job",
              results: {
                errors: 0,
                failures: 1,
                success: 2,
                skips: 3,
                total: 4,
              },
              pipeline: {
                created_at: "2024-12-04T06:42:05.836974",
                name: "pipeline 1",
              },
              status: "success",
              status_reason: "",
            },
            _type: "_doc",
            sort: ["2024-12-04T14:46:24.840Z"],
          },
        ],
        max_score: null,
        total: { relation: "eq", value: 1 },
      },
      timed_out: false,
      took: 1,
    } as IGetAnalyticsJobsResponse),
  ).toEqual([
    {
      date: "2024-12-04",
      datetime: DateTime.fromISO("2024-12-04"),
      pipelines: [
        {
          name: "pipeline 1",
          created_at: "2024-12-04T06:42:05.836974",
          jobs: [
            {
              id: "j1",
              name: "test-job",
              status: "success",
              status_reason: "",
              components: [
                {
                  display_name: "python3-kubernetes 11.0.0-6.el8",
                  id: "c1",
                  topic_id: "t1",
                },
                {
                  display_name: "ansible 2.9.27-1.el8ae",
                  id: "c2",
                  topic_id: "t1",
                },
              ],
              comment: "",
              results: {
                errors: 0,
                failures: 1,
                success: 2,
                skips: 3,
                total: 4,
              },
              duration: 905,
            },
          ],
        },
      ],
    },
  ]);
});

test("extractPipelinesFromAnalyticsJobs from 404 not found", () => {
  const payloadReturnedByApiWhenNotFound = {};
  expect(
    extractPipelinesFromAnalyticsJobs(payloadReturnedByApiWhenNotFound),
  ).toEqual([]);
});
