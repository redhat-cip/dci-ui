import { sortByName, sortByNewestFirst, sortByOldestFirst, sortByMainComponentType } from "./sort";

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

test("sortByMainComponentType", () => {
  expect(
    sortByMainComponentType([
      {
        id: "1",
        name: "b",
        type: "foo",
      },
      {
        id: "2",
        name: "A",
        type: "ocp",
      },
      {
        id: "3",
        name: "c",
        type: "compose-noinstall",
      },
      {
        id: "4",
        name: "d",
        type: "compose",
      },
      {
        id: "5",
        name: "f",
        type: "rpm",
      },
      {
        id: "6",
        name: "e",
        type: "rpm",
      },
    ])
  ).toEqual([
    {
      id: "4",
      name: "d",
      type: "compose",
    },
    {
      id: "3",
      name: "c",
      type: "compose-noinstall",
    },
    {
      id: "2",
      name: "A",
      type: "ocp",
    },
    {
      id: "1",
      name: "b",
      type: "foo",
    },
    {
      id: "6",
      name: "e",
      type: "rpm",
    },
    {
      id: "5",
      name: "f",
      type: "rpm",
    },
  ]);
});
