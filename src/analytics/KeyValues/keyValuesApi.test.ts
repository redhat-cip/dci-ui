import {
  extractKeyValues,
  IKeyValueEmptyResponse,
  IKeyValueResponse,
} from "./keyValuesApi";

test("extractKeyValues with empty data", () => {
  const emptyData: IKeyValueEmptyResponse = [];
  expect(extractKeyValues(emptyData)).toEqual({});
});

test("extractKeyValues with result", () => {
  const result: IKeyValueResponse = {
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
            keys_values: [
              {
                job_id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
                key: "workarounds",
                value: 1.0,
              },
            ],
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
  expect(extractKeyValues(result)).toEqual({
    workarounds: [
      {
        created_at: 1729175921696,
        value: 1.0,
        key: "workarounds",
        job: {
          id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
          name: "job1",
        },
      },
    ],
  });
});
