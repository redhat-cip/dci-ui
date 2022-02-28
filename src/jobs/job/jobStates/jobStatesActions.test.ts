import { addDuration, addPipelineStatus } from "./jobStatesActions";
import { IJobState } from "types";

test("addDuration in seconds", () => {
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
    } as IJobState,
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

test("addDuration get previous updated_at from previous file", () => {
  const jobStates = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
        },
      ],
    } as IJobState,
    {
      created_at: "2018-07-30T04:38:30.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
        },
      ],
    } as IJobState,
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

test("addDuration order jobStates and files per date", () => {
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
    } as IJobState,
    {
      created_at: "2018-07-30T04:38:08.000000",
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
        },
      ],
    } as IJobState,
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

test("addPipelineStatus with last status failure", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:38:10.000000", status: "new" },
    { created_at: "2018-07-30T04:39:10.000000", status: "new" },
    { created_at: "2018-07-30T04:40:10.000000", status: "pre-run" },
    { created_at: "2018-07-30T04:41:10.000000", status: "running" },
    { created_at: "2018-07-30T04:42:10.000000", status: "failure" },
  ] as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "running",
      pipelineStatus: "danger",
    },
    {
      created_at: "2018-07-30T04:42:10.000000",
      status: "failure",
      pipelineStatus: "danger",
    },
  ] as IJobState[];
  expect(addPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addPipelineStatus with last status success", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:38:10.000000", status: "new" },
    { created_at: "2018-07-30T04:39:10.000000", status: "new" },
    { created_at: "2018-07-30T04:40:10.000000", status: "pre-run" },
    { created_at: "2018-07-30T04:41:10.000000", status: "running" },
    { created_at: "2018-07-30T04:42:10.000000", status: "success" },
  ] as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "running",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:42:10.000000",
      status: "success",
      pipelineStatus: "success",
    },
  ] as IJobState[];
  expect(addPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addPipelineStatus with last status failure unordered", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:42:10.000000", status: "failure" },
    { created_at: "2018-07-30T04:41:10.000000", status: "running" },
    { created_at: "2018-07-30T04:40:10.000000", status: "pre-run" },
    { created_at: "2018-07-30T04:39:10.000000", status: "new" },
    { created_at: "2018-07-30T04:38:10.000000", status: "new" },
  ] as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "running",
      pipelineStatus: "danger",
    },
    {
      created_at: "2018-07-30T04:42:10.000000",
      status: "failure",
      pipelineStatus: "danger",
    },
  ] as IJobState[];
  expect(addPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addPipelineStatus with non final status", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:38:10.000000", status: "new" },
    { created_at: "2018-07-30T04:39:10.000000", status: "new" },
    { created_at: "2018-07-30T04:40:10.000000", status: "pre-run" },
    { created_at: "2018-07-30T04:41:10.000000", status: "running" },
  ] as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "running",
      pipelineStatus: "info",
    },
  ] as IJobState[];
  expect(addPipelineStatus(jobStates)).toEqual(expectedJobStates);
});


test("addPipelineStatus with running state in the middle", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:38:10.000000", status: "new" },
    { created_at: "2018-07-30T04:39:10.000000", status: "pre-run" },
    { created_at: "2018-07-30T04:40:10.000000", status: "running" },
    { created_at: "2018-07-30T04:41:10.000000", status: "post-run" },
    { created_at: "2018-07-30T04:42:10.000000", status: "success" },
  ] as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "running",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "post-run",
      pipelineStatus: "success",
    },
    {
      created_at: "2018-07-30T04:42:10.000000",
      status: "success",
      pipelineStatus: "success",
    },
  ] as IJobState[];
  expect(addPipelineStatus(jobStates)).toEqual(expectedJobStates);
});
