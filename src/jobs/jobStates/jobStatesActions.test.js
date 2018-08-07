import { addDuration } from "./jobStatesActions";

it("addDuration in seconds", () => {
  const elements = [
    {
      created_at: "2018-07-30T04:38:08.000000"
    },
    {
      created_at: "2018-07-30T04:42:33.000000"
    },
    {
      created_at: "2018-07-30T04:42:58.000000"
    }
  ];
  const expectedElements = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      pre_duration: null,
      next_duration: 265
    },
    {
      created_at: "2018-07-30T04:42:33.000000",
      pre_duration: 265,
      next_duration: 25
    },
    {
      created_at: "2018-07-30T04:42:58.000000",
      pre_duration: 25,
      next_duration: null
    }
  ];
  expect(addDuration(elements)).toEqual(expectedElements);
});

it("addDuration order by created at", () => {
  const elements = [
    {
      created_at: "2018-07-30T04:38:08.000000"
    },
    {
      created_at: "2018-07-30T04:42:33.000000"
    },
    {
      created_at: "2018-07-30T04:33:58.000000"
    }
  ];
  const expectedElements = [
    {
      created_at: "2018-07-30T04:33:58.000000",
      pre_duration: null,
      next_duration: 250
    },
    {
      created_at: "2018-07-30T04:38:08.000000",
      pre_duration: 250,
      next_duration: 265
    },
    {
      created_at: "2018-07-30T04:42:33.000000",
      pre_duration: 265,
      next_duration: null
    }
  ];
  expect(addDuration(elements)).toEqual(expectedElements);
});

it("addDuration one element", () => {
  const elements = [
    {
      created_at: "2018-07-30T04:38:08.000000"
    }
  ];
  const expectedElements = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      pre_duration: null,
      next_duration: null
    }
  ];
  expect(addDuration(elements)).toEqual(expectedElements);
});

it("addDuration no element", () => {
  expect(addDuration([])).toEqual([]);
});

it("addDuration with initial create_at set first element pre_duration", () => {
  const elements = [
    {
      created_at: "2018-07-30T04:38:08.000000"
    },
    {
      created_at: "2018-07-30T04:42:33.000000"
    },
    {
      created_at: "2018-07-30T04:42:58.000000"
    }
  ];
  const expectedElements = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      pre_duration: 8,
      next_duration: 265
    },
    {
      created_at: "2018-07-30T04:42:33.000000",
      pre_duration: 265,
      next_duration: 25
    },
    {
      created_at: "2018-07-30T04:42:58.000000",
      pre_duration: 25,
      next_duration: null
    }
  ];
  expect(addDuration(elements, "2018-07-30T04:38:00.000000")).toEqual(
    expectedElements
  );
});

it("addDuration with initial create_at one element", () => {
  const elements = [
    {
      created_at: "2018-07-30T04:38:08.000000"
    }
  ];
  const expectedElements = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      pre_duration: 8,
      next_duration: null
    }
  ];
  expect(addDuration(elements, "2018-07-30T04:38:00.000000")).toEqual(
    expectedElements
  );
});
