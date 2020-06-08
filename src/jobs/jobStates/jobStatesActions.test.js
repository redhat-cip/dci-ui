import { addDuration } from "./jobStatesActions";

it("addDuration in seconds", () => {
  const jobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:10.000000",
          updated_at: "2018-07-30T04:38:10.000000",
        },
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
        },
        {
          created_at: "2018-07-30T04:38:32.000000",
          updated_at: "2018-07-30T04:38:32.000000",
        },
      ],
    },
  ];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      duration: 22,
      files: [
        {
          created_at: "2018-07-30T04:38:10.000000",
          updated_at: "2018-07-30T04:38:10.000000",
          duration: 0,
        },
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
          duration: 20,
        },
        {
          created_at: "2018-07-30T04:38:32.000000",
          updated_at: "2018-07-30T04:38:32.000000",
          duration: 2,
        },
      ],
    },
  ];
  expect(addDuration(jobStates)).toEqual(expectedJobStates);
});

it("addDuration get previous updated_at from previous file", () => {
  const jobStates = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
        },
      ],
    },
    {
      created_at: "2018-07-30T04:38:30.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
        },
      ],
    },
  ];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      duration: 0,
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
          duration: 0,
        },
      ],
    },
    {
      created_at: "2018-07-30T04:38:30.000000",
      duration: 20,
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
          duration: 20,
        },
      ],
    },
  ];
  expect(addDuration(jobStates)).toEqual(expectedJobStates);
});

it("addDuration order jobStates and files per date", () => {
  const jobStates = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      files: [
        {
          created_at: "2018-07-30T04:40:30.000000",
          updated_at: "2018-07-30T04:40:30.000000",
        },
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
        },
      ],
    },
    {
      created_at: "2018-07-30T04:38:08.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
        },
      ],
    },
  ];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      duration: 0,
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
          duration: 0,
        },
      ],
    },
    {
      created_at: "2018-07-30T04:38:30.000000",
      duration: 140,
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
          duration: 20,
        },
        {
          created_at: "2018-07-30T04:40:30.000000",
          updated_at: "2018-07-30T04:40:30.000000",
          duration: 120,
        },
      ],
    },
  ];
  expect(addDuration(jobStates)).toEqual(expectedJobStates);
});
