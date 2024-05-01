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
      id: "j1",
      previous_job_id: null,
      children: [
        {
          id: "j2",
          previous_job_id: "j1",
          children: [],
        },
        {
          id: "j3",
          previous_job_id: "j1",
          children: [],
        },
        {
          id: "j4",
          previous_job_id: "j1",
          children: [],
        },
        {
          id: "j5",
          previous_job_id: "j1",
          children: [
            {
              id: "j6",
              previous_job_id: "j5",
              children: [
                {
                  id: "j7",
                  previous_job_id: "j6",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "j8",
      previous_job_id: null,
      children: [],
    },
  ]);
});
