import { DateTime } from "luxon";
import { extractPipelinesFromAnalyticsJobs } from "./pipelines";

test("extractPipelinesFromAnalyticsJobs", () => {
  expect(
    extractPipelinesFromAnalyticsJobs({
      _shards: { failed: 0, skipped: 0, successful: 1, total: 1 },
      hits: {
        hits: [
          {
            _id: "h2",
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
              created_at: "2024-12-04T16:32:24.840989",
              duration: 804,
              id: "j2",
              name: "job 2",
              results: {
                errors: 1,
                failures: 1,
                success: 1,
                skips: 3,
                total: 6,
              },
              pipeline: {
                id: "p1",
                created_at: "2024-12-04T06:42:05.836974",
                name: "pipeline",
              },
              status: "success",
              status_reason: "",
              keys_values: [],
              team: {
                id: "t1",
                name: "Team 1",
              },
            },
            _type: "_doc",
            sort: ["2024-12-04T14:46:24.840Z"],
          },
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
              name: "job 1",
              results: {
                errors: 0,
                failures: 1,
                success: 2,
                skips: 3,
                total: 6,
              },
              pipeline: {
                id: "p1",
                created_at: "2024-12-04T06:42:05.836974",
                name: "pipeline",
              },
              status: "success",
              status_reason: "",
              keys_values: [],
              team: {
                id: "t1",
                name: "Team 1",
              },
            },
            _type: "_doc",
            sort: ["2024-12-04T14:46:24.840Z"],
          },
        ],
        max_score: null,
        total: { relation: "eq", value: 2 },
      },
      timed_out: false,
      took: 1,
    }),
  ).toEqual([
    {
      date: "2024-12-04",
      datetime: DateTime.fromISO("2024-12-04"),
      pipelines: [
        {
          id: "p1",
          name: "pipeline",
          created_at: "2024-12-04T06:42:05.836974",
          jobs: [
            {
              id: "j1",
              datetime: DateTime.fromISO("2024-12-04T14:46:24.840989"),
              name: "job 1",
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
                total: 6,
              },
              duration: 905,
            },
            {
              id: "j2",
              datetime: DateTime.fromISO("2024-12-04T16:32:24.840989"),
              name: "job 2",
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
                errors: 1,
                failures: 1,
                success: 1,
                skips: 3,
                total: 6,
              },
              duration: 804,
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
