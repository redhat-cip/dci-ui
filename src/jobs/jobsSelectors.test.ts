import { IEnhancedJob } from "types";
import { groupJobsByPipeline } from "./jobsSelectors";

test("groupJobByPipeline", () => {
  const jobs = [
    {
      id: "j5",
      previous_job_id: "j1",
      created_at: "2018-06-14T15:30:50.139451",
    },
    {
      id: "j4",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:40.139451",
    },
    {
      id: "j3",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:30.139451",
    },
    {
      id: "j2",
      previous_job_id: "j1",
      created_at: "2018-06-14T15:30:20.139451",
    },
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:10.139451",
    },
  ] as unknown as IEnhancedJob[];
  const expectedJobs = [
    [
      {
        id: "j1",
        previous_job_id: null,
        created_at: "2018-06-14T15:30:10.139451",
      },
      {
        id: "j2",
        previous_job_id: "j1",
        created_at: "2018-06-14T15:30:20.139451",
      },
      {
        id: "j5",
        previous_job_id: "j1",
        created_at: "2018-06-14T15:30:50.139451",
      },
    ],
    [
      {
        id: "j4",
        previous_job_id: null,
        created_at: "2018-06-14T15:30:40.139451",
      },
    ],
    [
      {
        id: "j3",
        previous_job_id: null,
        created_at: "2018-06-14T15:30:30.139451",
      },
    ],
  ] as unknown as IEnhancedJob[][];
  expect(groupJobsByPipeline(jobs)).toEqual(expectedJobs);
});

test("groupJobByPipeline no pipeline", () => {
  const jobs = [
    {
      id: "j2",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:20.139451",
    },
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:10.139451",
    },
  ] as unknown as IEnhancedJob[];
  const expectedJobs = [
    [
      {
        id: "j2",
        previous_job_id: null,
        created_at: "2018-06-14T15:30:20.139451",
      },
    ],
    [
      {
        id: "j1",
        previous_job_id: null,
        created_at: "2018-06-14T15:30:10.139451",
      },
    ],
  ] as unknown as IEnhancedJob[][];
  expect(groupJobsByPipeline(jobs)).toEqual(expectedJobs);
});

test("groupJobByPipeline with jobs sequence", () => {
  const jobs = [
    {
      id: "j5",
      previous_job_id: "j3",
      created_at: "2018-06-14T15:30:50.139451",
    },
    {
      id: "j4",
      previous_job_id: "j2",
      created_at: "2018-06-14T15:30:40.139451",
    },
    {
      id: "j3",
      previous_job_id: "j2",
      created_at: "2018-06-14T15:30:30.139451",
    },
    {
      id: "j2",
      previous_job_id: "j1",
      created_at: "2018-06-14T15:30:20.139451",
    },
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:10.139451",
    },
  ] as unknown as IEnhancedJob[];
  const expectedJobs = [
    [
      {
        id: "j1",
        previous_job_id: null,
        created_at: "2018-06-14T15:30:10.139451",
      },
      {
        id: "j2",
        previous_job_id: "j1",
        created_at: "2018-06-14T15:30:20.139451",
      },
      {
        id: "j3",
        previous_job_id: "j2",
        created_at: "2018-06-14T15:30:30.139451",
      },
      {
        id: "j4",
        previous_job_id: "j2",
        created_at: "2018-06-14T15:30:40.139451",
      },
      {
        id: "j5",
        previous_job_id: "j3",
        created_at: "2018-06-14T15:30:50.139451",
      },
    ],
  ];
  expect(groupJobsByPipeline(jobs)).toEqual(expectedJobs);
});

test("groupJobByPipeline no jobs", () => {
  expect(groupJobsByPipeline([])).toEqual([]);
});
