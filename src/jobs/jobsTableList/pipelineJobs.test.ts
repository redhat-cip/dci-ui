import { IJob } from "types";
import { groupJobsByPipeline } from "./pipelineJobs";

test("groupJobByPipeline of jobs with no jobs", () => {
  expect(groupJobsByPipeline([])).toEqual([]);
});

test("groupJobByPipeline with jobs", () => {
  const jobs = [
    {
      id: "j8",
      previous_job_id: null,
    },
    {
      id: "j7",
      previous_job_id: "j6",
    },
    {
      id: "j6",
      previous_job_id: "j5",
    },
    {
      id: "j5",
      previous_job_id: "j1",
    },
    {
      id: "j4",
      previous_job_id: "j1",
    },
    {
      id: "j3",
      previous_job_id: "j1",
    },
    {
      id: "j2",
      previous_job_id: "j1",
    },
    {
      id: "j1",
      previous_job_id: null,
    },
  ] as unknown as IJob[];
  expect(groupJobsByPipeline(jobs)).toEqual([
    {
      id: "j8",
      previous_job_id: null,
      index: 0,
      children: [],
    },
    {
      id: "j1",
      previous_job_id: null,
      index: 7,
      children: [
        {
          id: "j2",
          previous_job_id: "j1",
          index: 6,
          children: [],
        },
        {
          id: "j3",
          previous_job_id: "j1",
          index: 5,
          children: [],
        },
        {
          id: "j4",
          previous_job_id: "j1",
          index: 4,
          children: [],
        },
        {
          id: "j5",
          previous_job_id: "j1",
          index: 3,
          children: [
            {
              id: "j6",
              previous_job_id: "j5",
              index: 2,
              children: [
                {
                  id: "j7",
                  previous_job_id: "j6",
                  index: 1,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
});

test("nrt groupJobByPipeline with jobs keep job order", () => {
  const jobs = [
    {
      id: "j3",
      previous_job_id: null,
    },
    {
      id: "j2",
      previous_job_id: null,
    },
    {
      id: "j1",
      previous_job_id: null,
    },
  ] as unknown as IJob[];
  expect(groupJobsByPipeline(jobs)).toEqual([
    {
      id: "j3",
      previous_job_id: null,
      children: [],
      index: 0,
    },
    {
      id: "j2",
      previous_job_id: null,
      children: [],
      index: 1,
    },
    {
      id: "j1",
      previous_job_id: null,
      children: [],
      index: 2,
    },
  ]);
});
