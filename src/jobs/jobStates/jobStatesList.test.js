import { addDuration } from "./JobStatesList";

it("addDuration to no jobStates", () => {
  expect(addDuration([])).toEqual([]);
});

it("addDuration to one file in seconds", () => {
  const files = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:30.000000"
    }
  ];
  const expectedFiles = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:30.000000",
      duration: null
    }
  ];
  expect(addDuration(files)).toEqual(expectedFiles);
});

it("addDuration to two files", () => {
  const files = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:30.000000"
    },
    {
      created_at: "2018-07-30T04:38:35.000000",
      updated_at: "2018-07-30T04:38:35.000000"
    }
  ];
  const expectedFiles = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:30.000000",
      duration: null
    },
    {
      created_at: "2018-07-30T04:38:35.000000",
      updated_at: "2018-07-30T04:38:35.000000",
      duration: 5
    }
  ];
  expect(addDuration(files)).toEqual(expectedFiles);
});

it("addDuration use previous updated_at", () => {
  const files = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:35.000000"
    },
    {
      created_at: "2018-07-30T04:38:40.000000",
      updated_at: "2018-07-30T04:38:45.000000"
    }
  ];
  const expectedFiles = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:35.000000",
      duration: null
    },
    {
      created_at: "2018-07-30T04:38:40.000000",
      updated_at: "2018-07-30T04:38:45.000000",
      duration: 5
    }
  ];
  expect(addDuration(files)).toEqual(expectedFiles);
});

it("addDuration order by created_at", () => {
  const files = [
    {
      created_at: "2018-07-30T04:38:35.000000",
      updated_at: "2018-07-30T04:38:35.000000"
    },
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:30.000000"
    }
  ];
  const expectedFiles = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:30.000000",
      duration: null
    },
    {
      created_at: "2018-07-30T04:38:35.000000",
      updated_at: "2018-07-30T04:38:35.000000",
      duration: 5
    }
  ];
  expect(addDuration(files)).toEqual(expectedFiles);
});
