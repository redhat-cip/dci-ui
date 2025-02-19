import { buildComponentCoverage } from "./componentCoverage";
import { IGetAnalyticsJobsResponse } from "types";

test("buildComponentCoverage with result", () => {
  const result: IGetAnalyticsJobsResponse = {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      hits: [
        {
          _id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
          _index: "jobs",
          _score: null,
          _source: {
            created_at: "2024-10-17T14:38:41.696112",
            id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
            name: "job1",
            keys_values: [],
            comment: "",
            components: [
              {
                display_name:
                  "dci-pipeline 0.9.0-1.202501231706git952ef0d6.el8",
                type: "rpm",
                id: "4f3c9d1b-72a9-41db-b2f3-507e5c1a8574",
                topic_id: "a9e82f3e-c1fd-4a21-81b3-56d4e3fa104f",
              },
              {
                display_name:
                  "python3-kubernetes 26.1.0-4.202412131927git8cf7ce6a.el8",
                id: "73b01e3d-f9f6-4377-97d0-e18b455276aa",
                topic_id: "c5f764d3-bd71-48d9-b75c-dc08c2de5e71",
                type: "rpm",
              },
            ],
            duration: 905,
            results: {
              errors: 0,
              failures: 1,
              success: 2,
              skips: 3,
              total: 6,
            },
            pipeline: null,
            status: "success",
            status_reason: "",
            team: {
              id: "t1",
              name: "Team 1",
            },
            topic: {
              name: "Topic 1",
            },
            tags: ["tag1", "tag 2"],
          },
          _type: "_doc",
          sort: ["2024-10-17T14:38:41.696Z"],
        },
      ],
      max_score: null,
      total: {
        relation: "eq",
        value: 684,
      },
    },
    timed_out: false,
    took: 668,
  };
  expect(buildComponentCoverage(result)).toEqual([
    {
      id: "4f3c9d1b-72a9-41db-b2f3-507e5c1a8574",
      display_name: "dci-pipeline 0.9.0-1.202501231706git952ef0d6.el8",
      type: "rpm",
      nbOfSuccessfulJobs: 1,
      nbOfJobs: 1,
      topic_id: "a9e82f3e-c1fd-4a21-81b3-56d4e3fa104f",
      jobs: [
        {
          id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
          created_at: "2024-10-17T14:38:41.696112",
          status: "success",
          name: "job1",
        },
      ],
      tags: ["tag1", "tag 2"],
    },
    {
      id: "73b01e3d-f9f6-4377-97d0-e18b455276aa",
      display_name: "python3-kubernetes 26.1.0-4.202412131927git8cf7ce6a.el8",
      type: "rpm",
      nbOfSuccessfulJobs: 1,
      nbOfJobs: 1,
      topic_id: "c5f764d3-bd71-48d9-b75c-dc08c2de5e71",
      jobs: [
        {
          id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
          created_at: "2024-10-17T14:38:41.696112",
          status: "success",
          name: "job1",
        },
      ],
      tags: ["tag1", "tag 2"],
    },
  ]);
});
