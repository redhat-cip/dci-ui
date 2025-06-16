import { ITopic } from "types";
import {
  sortByName,
  sortByNewestFirst,
  sortByOldestFirst,
  sortByMainComponentType,
  sortWithSemver,
} from "./sort";

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
    ]),
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
        id: "2",
        created_at: "2018-06-16T16:08:17.125194",
      },
      {
        id: "1",
        created_at: "2018-06-14T15:30:39.139451",
      },
    ]),
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
    ]),
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
      "released_at",
    ),
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
    ]),
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

test("sortWithSemver", () => {
  expect([].sort(sortWithSemver)).toEqual([]);
  expect(
    [
      { name: "OSP16.2" } as ITopic,
      { name: "OSP10" } as ITopic,
      { name: "OSP16.1" } as ITopic,
    ].sort(sortWithSemver),
  ).toEqual([{ name: "OSP16.2" }, { name: "OSP16.1" }, { name: "OSP10" }]);
  expect(
    [
      { name: "OCP-4.10" } as ITopic,
      { name: "OCP-4.4" } as ITopic,
      { name: "OCP-4.5" } as ITopic,
    ].sort(sortWithSemver),
  ).toEqual([{ name: "OCP-4.10" }, { name: "OCP-4.5" }, { name: "OCP-4.4" }]);
  expect(
    [
      { name: "RHEL-8.1" } as ITopic,
      { name: "RHEL-8.0" } as ITopic,
      { name: "RHEL-8.5" } as ITopic,
    ].sort(sortWithSemver),
  ).toEqual([{ name: "RHEL-8.5" }, { name: "RHEL-8.1" }, { name: "RHEL-8.0" }]);
});
