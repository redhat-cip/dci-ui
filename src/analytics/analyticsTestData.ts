import {
  IAnalyticsJob,
  IAnalyticsKeysValuesJob,
  IAnalyticsResultsJob,
} from "types";

export const analyticsOneJob: IAnalyticsJob[] = [
  {
    configuration: null,
    created_at: "2024-10-17T14:38:41.696112",
    id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
    name: "job1",
    url: "",
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
];

export const analyticsOneKeysValuesJob: IAnalyticsKeysValuesJob[] = [
  {
    ...analyticsOneJob[0],
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
  },
];

export const analyticsOneResultsJob: IAnalyticsResultsJob[] = [
  {
    ...analyticsOneJob[0],
    results: [
      {
        errors: 0,
        failures: 1,
        success: 2,
        skips: 3,
        total: 6,
      },
    ],
  },
];

export const analyticsTwoJobs: IAnalyticsJob[] = [
  {
    configuration: null,
    created_at: "2024-12-04T16:32:24.840989",
    id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
    name: "job2",
    url: "",
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
  ...analyticsOneJob,
];

export const analyticsTwoKeysValuesJobs: IAnalyticsKeysValuesJob[] = [
  {
    ...analyticsTwoJobs[0],
    keys_values: [
      {
        job_id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
        key: "workarounds",
        value: 2.0,
      },
    ],
  },
  ...analyticsOneKeysValuesJob,
];

export const analyticsTwoResultsJobs: IAnalyticsResultsJob[] = [
  {
    ...analyticsTwoJobs[0],
    results: [
      {
        errors: 1,
        failures: 1,
        success: 1,
        skips: 3,
        total: 6,
      },
    ],
  },
  ...analyticsOneResultsJob,
];
