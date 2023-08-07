import { transform, getDomain } from "./tasksDurationPerJob";

test("transform data", () => {
  expect(
    transform({
      hits: [
        {
          _id: "j1",
          _index: "tasks_duration_cumulated",
          _score: 29.969517,
          _source: {
            created_at: "2021-09-20T20:58:02.041653",
            data: [
              {
                duration: 0,
                name: "t1",
              },
              {
                duration: 8,
                name: "t2",
              },
              {
                duration: 9,
                name: "t3",
              },
            ],
            job_id: "j1",
            job_name: "n1",
            job_status: "failure",
            remoteci_id: "r1",
            topic_id: "t1",
          },
          _type: "_doc",
        },
        {
          _id: "j2",
          _index: "tasks_duration_cumulated",
          _score: 29.969517,
          _source: {
            created_at: "2021-09-20T22:31:02.536562",
            data: [
              {
                duration: 0,
                name: "t1",
              },
              {
                duration: 1,
                name: "t2",
              },
              {
                duration: 2,
                name: "t3",
              },
            ],
            job_id: "j2",
            job_name: "n2",
            job_status: "success",
            remoteci_id: "r1",
            topic_id: "t1",
          },
          _type: "_doc",
        },
      ],
      max_score: 29.969517,
      total: {
        relation: "eq",
        value: 77,
      },
    }),
  ).toEqual([
    {
      id: "j1",
      name: "n1",
      status: "failure",
      created_at: "2021-09-20T20:58:02.041653",
      data: [
        {
          name: "t1",
          x: 1,
          y: 0,
        },
        {
          name: "t2",
          x: 2,
          y: 8,
        },
        {
          name: "t3",
          x: 3,
          y: 9,
        },
      ],
    },
    {
      id: "j2",
      name: "n2",
      status: "success",
      created_at: "2021-09-20T22:31:02.536562",
      data: [
        {
          name: "t1",
          x: 1,
          y: 0,
        },
        {
          name: "t2",
          x: 2,
          y: 1,
        },
        {
          name: "t3",
          x: 3,
          y: 2,
        },
      ],
    },
  ]);
});

test("get domain null", () => {
  expect(
    getDomain(null, {
      left: null,
      right: null,
    }),
  ).toEqual({
    minXDomain: 0,
    maxXDomain: 0,
    minYDomain: 0,
    maxYDomain: 0,
  });
});

test("get domain", () => {
  expect(
    getDomain(
      [
        {
          id: "j1",
          name: "j1",
          status: "success",
          created_at: "2021-09-20T22:31:02.536562",
          data: [
            {
              name: "t1",
              x: 1,
              y: 0,
            },
            {
              name: "t2",
              x: 2,
              y: 8,
            },
            {
              name: "t3",
              x: 3,
              y: 9,
            },
            {
              name: "t4",
              x: 4,
              y: 10,
            },
          ],
        },
        {
          id: "j2",
          name: "j2",
          status: "success",
          created_at: "2021-09-21T22:31:02.536562",
          data: [
            {
              name: "t1",
              x: 1,
              y: 0,
            },
            {
              name: "t2",
              x: 2,
              y: 1,
            },
            {
              name: "t3",
              x: 3,
              y: 2,
            },
          ],
        },
      ],
      {
        left: null,
        right: null,
      },
    ),
  ).toEqual({
    minXDomain: 1,
    maxXDomain: 4,
    minYDomain: 0,
    maxYDomain: 10,
  });
});

test("get domain with an area", () => {
  expect(
    getDomain(
      [
        {
          id: "j1",
          name: "j1",
          status: "success",
          created_at: "2021-09-20T22:31:02.536562",
          data: [
            {
              name: "t1",
              x: 1,
              y: 0,
            },
            {
              name: "t2",
              x: 2,
              y: 8,
            },
            {
              name: "t3",
              x: 3,
              y: 9,
            },
            {
              name: "t4",
              x: 4,
              y: 10,
            },
          ],
        },
        {
          id: "j2",
          name: "j2",
          status: "success",
          created_at: "2021-09-21T22:31:02.536562",
          data: [
            {
              name: "t1",
              x: 1,
              y: 0,
            },
            {
              name: "t2",
              x: 2,
              y: 1,
            },
            {
              name: "t3",
              x: 3,
              y: 2,
            },
          ],
        },
      ],
      {
        left: 2,
        right: 3,
      },
    ),
  ).toEqual({
    minXDomain: 2,
    maxXDomain: 3,
    minYDomain: 1,
    maxYDomain: 9,
  });
});

test("get domain with an area and empty data", () => {
  expect(
    getDomain(
      [
        {
          id: "j1",
          name: "j1",
          status: "success",
          created_at: "2021-09-20T22:31:02.536562",
          data: [
            {
              name: "t1",
              x: 1,
              y: 0,
            },
            {
              name: "t2",
              x: 2,
              y: 8,
            },
            {
              name: "t3",
              x: 3,
              y: 9,
            },
            {
              name: "t4",
              x: 4,
              y: 10,
            },
          ],
        },
        {
          id: "j2",
          name: "j2",
          status: "success",
          created_at: "2021-09-21T22:31:02.536562",
          data: [],
        },
      ],
      {
        left: 2,
        right: 3,
      },
    ),
  ).toEqual({
    minXDomain: 2,
    maxXDomain: 3,
    minYDomain: 8,
    maxYDomain: 9,
  });
});

test("get domain with an area and right data inside this area", () => {
  expect(
    getDomain(
      [
        {
          id: "j1",
          name: "j1",
          status: "success",
          created_at: "2021-09-20T22:31:02.536562",
          data: [
            {
              name: "t1",
              x: 1,
              y: 0,
            },
            {
              name: "t2",
              x: 2,
              y: 10,
            },
          ],
        },
        {
          id: "j2",
          name: "j2",
          status: "success",
          created_at: "2021-09-21T22:31:02.536562",
          data: [
            {
              name: "t1",
              x: 1,
              y: 0,
            },
            {
              name: "t2",
              x: 2,
              y: 1,
            },
            {
              name: "t3",
              x: 3,
              y: 2,
            },
            {
              name: "t4",
              x: 4,
              y: 2,
            },
          ],
        },
      ],
      {
        left: 1,
        right: 4,
      },
    ),
  ).toEqual({
    minXDomain: 1,
    maxXDomain: 2,
    minYDomain: 0,
    maxYDomain: 10,
  });
});
