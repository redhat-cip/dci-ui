import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
} from "types";

export const analyticsOneJob: IGetAnalyticsJobsResponse = {
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
          configuration: null,
          created_at: "2024-10-17T14:38:41.696112",
          id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
          name: "job1",
          keys_values: [
            {
              job_id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
              key: "workarounds",
              value: 1.0,
            },
            {
              job_id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
              key: "reboots",
              value: 0,
            },
          ],
          comment: "",
          components: [
            {
              display_name: "python3-kubernetes 11.0.0-6.el8",
              id: "c1",
              topic_id: "t1",
              type: "rpm",
            },
            {
              display_name: "OpenShift 4.14.48",
              id: "c2",
              topic_id: "t1",
              type: "ocp",
            },
          ],
          duration: 905,
          results: [
            {
              errors: 0,
              failures: 1,
              success: 2,
              skips: 3,
              total: 6,
            },
          ],
          pipeline: {
            id: "p1",
            created_at: "2024-12-04T06:42:05.836974",
            name: "pipeline",
          },
          status: "success",
          status_reason: "",
          team: {
            id: "t1",
            name: "Team 1",
          },
          topic: {
            name: "Topic 1",
          },
          remoteci: {
            name: "Remoteci 1",
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

export const analyticsTwoJobs: IGetAnalyticsJobsResponse = {
  _shards: {
    failed: 0,
    skipped: 0,
    successful: 2,
    total: 2,
  },
  hits: {
    hits: [
      {
        _id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
        _index: "jobs",
        _score: null,
        _source: {
          configuration: null,
          created_at: "2024-12-04T16:32:24.840989",
          id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
          name: "job2",
          keys_values: [
            {
              job_id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
              key: "workarounds",
              value: 2.0,
            },
          ],
          comment: "",
          components: [
            {
              display_name: "python3-kubernetes 11.0.0-6.el8",
              id: "c1",
              topic_id: "t1",
              type: "rpm",
            },
            {
              display_name: "OpenShift 4.14.48",
              id: "c2",
              topic_id: "t1",
              type: "ocp",
            },
          ],
          duration: 905,
          results: [
            {
              errors: 1,
              failures: 1,
              success: 1,
              skips: 3,
              total: 6,
            },
          ],
          pipeline: {
            id: "p1",
            created_at: "2024-12-04T06:42:05.836974",
            name: "pipeline",
          },
          status: "success",
          status_reason: "",
          team: {
            id: "t1",
            name: "Team 1",
          },
          topic: {
            name: "Topic 2",
          },
          remoteci: {
            name: "Remoteci 1",
          },
          tags: ["tag1", "tag 2"],
        },
        _type: "_doc",
        sort: ["2024-10-17T14:38:41.696Z"],
      },
      { ...analyticsOneJob.hits.hits[0] },
    ],
    max_score: null,
    total: {
      relation: "eq",
      value: 2,
    },
  },
  timed_out: false,
  took: 718,
};

export const analyticsEmptyData: IGetAnalyticsJobsEmptyResponse = {};
