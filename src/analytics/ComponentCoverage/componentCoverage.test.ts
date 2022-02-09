import {
  buildComponentCoverage,
  getComponentCoverageDomain,
} from "./componentCoverage";

test("buildComponentCoverage", () => {
  expect(
    buildComponentCoverage({
      total: {
        value: 8,
        relation: "eq",
      },
      max_score: null,
      hits: [
        {
          _id: "es1",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c1",
            component_name: "c1",
            failed_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j1",
              },
              {
                created_at: "2022-01-14T01:54:26.817058",
                id: "j3",
              },
              {
                created_at: "2022-01-14T01:55:05.186011",
                id: "j4",
              },
              {
                created_at: "2022-01-14T02:01:09.214449",
                id: "j5",
              },
            ],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:53:26.817058",
                id: "j2",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: "red_hat",
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "3b8ea5e8-3756-4ce9-afd1-573fd2b57816",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c2",
            component_name: "c2",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j6",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: "red_hat",
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "es3",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c3",
            component_name: "c3",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j7",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: "red_hat",
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "es5",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c4",
            component_name: "c4",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [],
            tags: ["tag2"],
            team_id: "red_hat",
            topic_id: "to1",
          },
          _type: "_doc",
        },
      ],
    })
  ).toEqual({
    c1: {
      id: "c1",
      name: "c1",
      nbOfSuccessfulJobs: 1,
      nbOfJobs: 5,
      topic_id: "to1",
      jobs: [
        {
          created_at: "2022-01-14T01:19:28.198117",
          id: "j1",
          status: "failure",
        },
        {
          created_at: "2022-01-14T01:53:26.817058",
          id: "j2",
          status: "success",
        },
        {
          created_at: "2022-01-14T01:54:26.817058",
          id: "j3",
          status: "failure",
        },
        {
          created_at: "2022-01-14T01:55:05.186011",
          id: "j4",
          status: "failure",
        },
        {
          created_at: "2022-01-14T02:01:09.214449",
          id: "j5",
          status: "failure",
        },
      ],
    },
    c2: {
      id: "c2",
      name: "c2",
      nbOfSuccessfulJobs: 1,
      nbOfJobs: 1,
      topic_id: "to1",
      jobs: [
        {
          created_at: "2022-01-14T01:19:28.198117",
          id: "j6",
          status: "success",
        },
      ],
    },
    c3: {
      id: "c3",
      name: "c3",
      nbOfSuccessfulJobs: 1,
      nbOfJobs: 1,
      topic_id: "to1",
      jobs: [
        {
          created_at: "2022-01-14T01:19:28.198117",
          id: "j7",
          status: "success",
        },
      ],
    },
    c4: {
      id: "c4",
      name: "c4",
      nbOfSuccessfulJobs: 0,
      nbOfJobs: 0,
      topic_id: "to1",
      jobs: [],
    },
  });
});

test("getComponentCoverageDomain", () => {
  expect(
    getComponentCoverageDomain({
      c1: {
        id: "c1",
        name: "c1",
        nbOfSuccessfulJobs: 1,
        nbOfJobs: 5,
        topic_id: "to1",
        jobs: [
          {
            created_at: "2022-01-14T01:19:28.198117",
            id: "j1",
            status: "failure",
          },
          {
            created_at: "2022-01-14T01:53:26.817058",
            id: "j2",
            status: "success",
          },
          {
            created_at: "2022-01-14T01:54:26.817058",
            id: "j3",
            status: "failure",
          },
          {
            created_at: "2022-01-14T01:45:05.186011",
            id: "j4",
            status: "failure",
          },
          {
            created_at: "2022-01-14T02:01:09.214449",
            id: "j5",
            status: "failure",
          },
        ],
      },
      c2: {
        id: "c2",
        name: "c2",
        nbOfSuccessfulJobs: 1,
        nbOfJobs: 1,
        topic_id: "to1",
        jobs: [
          {
            created_at: "2022-01-14T01:19:28.198117",
            id: "j6",
            status: "success",
          },
        ],
      },
      c3: {
        id: "c3",
        name: "c3",
        nbOfSuccessfulJobs: 1,
        nbOfJobs: 1,
        topic_id: "to1",
        jobs: [
          {
            created_at: "2022-01-14T01:19:28.198117",
            id: "j7",
            status: "success",
          },
        ],
      },
      c4: {
        id: "c4",
        name: "c4",
        nbOfSuccessfulJobs: 0,
        nbOfJobs: 0,
        topic_id: "to1",
        jobs: [],
      },
    })
  ).toEqual({
    nbOfJobs: { min: 0, max: 5 },
    nbOfSuccessfulJobs: { min: 0, max: 1 },
  });
});
