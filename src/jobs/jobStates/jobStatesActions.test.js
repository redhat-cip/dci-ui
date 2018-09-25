import { addDuration } from "./jobStatesActions";

it("addDuration to no jobStates", () => {
  expect(addDuration([])).toEqual([]);
});

it("addDuration to one jobState in seconds", () => {
  const elements = [
    {
      created_at: "2018-07-30T04:38:25.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000"
        },
        {
          created_at: "2018-07-30T04:38:33.000000"
        },
        {
          created_at: "2018-07-30T04:38:40.000000"
        }
      ]
    }
  ];
  const expectedElements = [
    {
      created_at: "2018-07-30T04:38:25.000000",
      duration: 15,
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          duration: 5
        },
        {
          created_at: "2018-07-30T04:38:33.000000",
          duration: 3
        },
        {
          created_at: "2018-07-30T04:38:40.000000",
          duration: 7
        }
      ]
    }
  ];
  expect(addDuration(elements)).toEqual(expectedElements);
});

it("addDuration to two jobStates", () => {
  const elements = [
    {
      created_at: "2018-07-30T04:38:25.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000"
        }
      ]
    },
    {
      created_at: "2018-07-30T04:42:25.000000",
      files: [
        {
          created_at: "2018-07-30T04:42:35.000000"
        },
        {
          created_at: "2018-07-30T04:42:36.000000"
        }
      ]
    }
  ];
  const expectedElements = [
    {
      created_at: "2018-07-30T04:38:25.000000",
      duration: 5,
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          duration: 5
        }
      ]
    },
    {
      created_at: "2018-07-30T04:42:25.000000",
      duration: 11,
      files: [
        {
          created_at: "2018-07-30T04:42:35.000000",
          duration: 10
        },
        {
          created_at: "2018-07-30T04:42:36.000000",
          duration: 1
        }
      ]
    }
  ];
  expect(addDuration(elements)).toEqual(expectedElements);
});

it("addDuration order by created_at", () => {
  const elements = [
    {
      created_at: "2018-07-30T04:42:01.000000",
      files: [
        {
          created_at: "2018-07-30T04:42:36.000000"
        },
        {
          created_at: "2018-07-30T04:42:35.000000"
        }
      ]
    },
    {
      created_at: "2018-07-30T04:35:02.000000",
      files: []
    }
  ];
  const expectedElements = [
    {
      created_at: "2018-07-30T04:35:02.000000",
      duration: 0,
      files: []
    },
    {
      created_at: "2018-07-30T04:42:01.000000",
      duration: 35,
      files: [
        {
          created_at: "2018-07-30T04:42:35.000000",
          duration: 34
        },
        {
          created_at: "2018-07-30T04:42:36.000000",
          duration: 1
        }
      ]
    }
  ];
  expect(addDuration(elements)).toEqual(expectedElements);
});
