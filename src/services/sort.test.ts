import { sortByName, sortByNewestFirst, sortByOldestFirst } from "./sort";

it("sortByName", () => {
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

it("sortByNewestFirst", () => {
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

it("sortByOldestFirst", () => {
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
