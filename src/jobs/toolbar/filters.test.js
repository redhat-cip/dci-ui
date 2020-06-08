import {
  createTeamsFilter,
  createTopicsFilter,
  getCurrentFilters,
  removeFilters,
  removeFilter,
} from "./filters";

it("createTeamsFilter", () => {
  const teams = [
    {
      id: "t1",
      name: "t1",
      remotecis: [
        {
          id: "r1",
          name: "r1",
        },
      ],
    },
  ];
  const expectedTeamsFilter = [
    {
      filterValues: [
        {
          key: "remoteci_id",
          name: "r1",
          value: "r1",
        },
      ],
      id: "t1",
      key: "team_id",
      name: "t1",
      value: "t1",
    },
  ];
  expect(createTeamsFilter(teams)).toEqual(expectedTeamsFilter);
});

it("createTeamsFilter remove team without remoteci", () => {
  const teams = [
    {
      id: "t1",
      name: "t1",
      remotecis: [],
    },
  ];
  const expectedTeamsFilter = [];
  expect(createTeamsFilter(teams)).toEqual(expectedTeamsFilter);
});

it("getCurrentFilters", () => {
  const activeFilters = [
    {
      key: "team_id",
      value: "t1",
    },
    {
      key: "remoteci_id",
      value: "r1",
    },
  ];
  const filters = [
    {
      id: "t1",
      key: "team_id",
      name: "t1",
      value: "t1",
    },
    {
      id: "t2",
      key: "team_id",
      name: "t2",
      value: "t2",
    },
  ];
  const expectedFilters = {
    remoteci_id: null,
    team_id: {
      id: "t1",
      key: "team_id",
      name: "t1",
      value: "t1",
    },
  };
  expect(getCurrentFilters(activeFilters, filters)).toEqual(expectedFilters);
});

it("removeFilters", () => {
  const filters = [
    {
      key: "team_id",
      value: "t1",
    },
    {
      key: "remoteci_id",
      value: "r1",
    },
    {
      key: "status",
      value: "s1",
    },
  ];
  const expectedFilters = [
    {
      key: "status",
      value: "s1",
    },
  ];
  expect(removeFilters(filters, ["team_id", "remoteci_id"])).toEqual(
    expectedFilters
  );
});

it("removeFilter", () => {
  const filters = [
    {
      key: "team_id",
      value: "t1",
    },
    {
      key: "remoteci_id",
      value: "r1",
    },
    {
      key: "status",
      value: "s1",
    },
  ];
  const expectedFilters = [
    {
      key: "team_id",
      value: "t1",
    },
    {
      key: "remoteci_id",
      value: "r1",
    },
  ];
  expect(removeFilter(filters, "status")).toEqual(expectedFilters);
});

it("createTopicsFilter", () => {
  const topics = [
    {
      id: "t1",
      name: "t1",
    },
  ];
  const expectedTopicsFilter = [
    {
      id: "t1",
      key: "topic_id",
      name: "t1",
      value: "t1",
    },
  ];
  expect(createTopicsFilter(topics)).toEqual(expectedTopicsFilter);
});
