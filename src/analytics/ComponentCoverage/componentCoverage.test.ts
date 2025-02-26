import { analyticsOneJob } from "analytics/analyticsTestData";
import { buildComponentCoverage } from "./componentCoverage";

test("buildComponentCoverage with result", () => {
  expect(buildComponentCoverage(analyticsOneJob)).toEqual([
    {
      id: "c1",
      display_name: "python3-kubernetes 11.0.0-6.el8",
      type: "rpm",
      nbOfSuccessfulJobs: 1,
      nbOfJobs: 1,
      topic_id: "t1",
      jobs: [
        {
          id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
          created_at: "2024-10-17T14:38:41.696112",
          status: "success",
          name: "job1",
        },
      ],
      tags: ["tag1", "tag 2"],
    },
    {
      id: "c2",
      display_name: "ansible 2.9.27-1.el8ae",
      type: "rpm",
      nbOfSuccessfulJobs: 1,
      nbOfJobs: 1,
      topic_id: "t1",
      jobs: [
        {
          id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
          created_at: "2024-10-17T14:38:41.696112",
          status: "success",
          name: "job1",
        },
      ],
      tags: ["tag1", "tag 2"],
    },
  ]);
});
