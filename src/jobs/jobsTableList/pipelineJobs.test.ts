import type { IJob } from "types";
import { groupJobsByPipeline } from "./pipelineJobs";

test("groupJobByPipeline of jobs with no jobs", () => {
  expect(groupJobsByPipeline([])).toEqual({ jobNodes: [], maxLevel: 0 });
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
  expect(groupJobsByPipeline(jobs)).toEqual({
    jobNodes: [
      {
        id: "j8",
        previous_job_id: null,
        index: 0,
        level: 0,
        children: [],
      },
      {
        id: "j1",
        previous_job_id: null,
        index: 7,
        level: 0,
        children: [
          {
            id: "j2",
            previous_job_id: "j1",
            index: 6,
            level: 1,
            children: [],
          },
          {
            id: "j3",
            previous_job_id: "j1",
            index: 5,
            level: 1,
            children: [],
          },
          {
            id: "j4",
            previous_job_id: "j1",
            index: 4,
            level: 1,
            children: [],
          },
          {
            id: "j5",
            previous_job_id: "j1",
            index: 3,
            level: 1,
            children: [
              {
                id: "j6",
                previous_job_id: "j5",
                index: 2,
                level: 2,
                children: [
                  {
                    id: "j7",
                    previous_job_id: "j6",
                    index: 1,
                    level: 3,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    maxLevel: 3,
  });
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
  expect(groupJobsByPipeline(jobs).jobNodes).toEqual([
    {
      id: "j3",
      previous_job_id: null,
      children: [],
      index: 0,
      level: 0,
    },
    {
      id: "j2",
      previous_job_id: null,
      children: [],
      index: 1,
      level: 0,
    },
    {
      id: "j1",
      previous_job_id: null,
      children: [],
      index: 2,
      level: 0,
    },
  ]);
});

test("nrt groupJobByPipeline keep all jobs if previous_job_id not null but not present in the list", () => {
  const jobs = [
    {
      id: "j1",
      previous_job_id: "j2",
    },
    {
      id: "j3",
      previous_job_id: "j4",
    },
  ] as unknown as IJob[];
  expect(groupJobsByPipeline(jobs).jobNodes).toEqual([
    {
      id: "j1",
      previous_job_id: "j2",
      children: [],
      index: 0,
      level: 0,
    },
    {
      id: "j3",
      previous_job_id: "j4",
      children: [],
      index: 1,
      level: 0,
    },
  ]);
});
