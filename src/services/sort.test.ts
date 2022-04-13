import { sortByName, sortByNewestFirst, sortByOldestFirst } from "./sort";

test("sortByName", () => {
  expect(
    sortByName([
      {
        id: "1",
        name: "b",
      },
      {
        id: "2",
        name: "A",
      },
    ])
  ).toEqual([
    {
      id: "2",
      name: "A",
    },
    {
      id: "1",
      name: "b",
    },
  ]);
});

test("sortByOldestFirst", () => {
  expect(
    sortByOldestFirst([
      {
        id: "1",
        created_at: "2018-06-14T15:30:39.139451",
      },
      {
        id: "2",
        created_at: "2018-06-16T16:08:17.125194",
      },
    ])
  ).toEqual([
    {
      id: "1",
      created_at: "2018-06-14T15:30:39.139451",
    },
    {
      id: "2",
      created_at: "2018-06-16T16:08:17.125194",
    },
  ]);
});

test("sortByNewestFirst", () => {
  expect(
    sortByNewestFirst([
      {
        id: "1",
        created_at: "2018-06-14T15:30:39.139451",
      },
      {
        id: "2",
        created_at: "2018-06-16T16:08:17.125194",
      },
    ])
  ).toEqual([
    {
      id: "2",
      created_at: "2018-06-16T16:08:17.125194",
    },
    {
      id: "1",
      created_at: "2018-06-14T15:30:39.139451",
    },
  ]);
});

test("sortByNewestFirst different key", () => {
  expect(
    sortByNewestFirst(
      [
        {
          id: "1",
          created_at: "2022-04-03T00:00:00.123456",
          released_at: "2022-04-02T00:00:00.123456",
        },
        {
          id: "2",
          created_at: "2022-04-04T00:00:00.123456",
          released_at: "2022-04-01T00:00:00.123456",
        },
      ],
      "released_at"
    )
  ).toEqual([
    {
      id: "1",
      created_at: "2022-04-03T00:00:00.123456",
      released_at: "2022-04-02T00:00:00.123456",
    },
    {
      id: "2",
      created_at: "2022-04-04T00:00:00.123456",
      released_at: "2022-04-01T00:00:00.123456",
    },
  ]);
});
