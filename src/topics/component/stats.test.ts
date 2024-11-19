import { getPercentageOfSuccessfulJobs } from "./stats";

test("get percentage of successful job", () => {
  expect(
    getPercentageOfSuccessfulJobs([
      {
        id: "j1",
        status: "success",
      },
    ]),
  ).toBe(100);
  expect(getPercentageOfSuccessfulJobs([])).toBe(0);
});

test("get percentage of successful job rounded", () => {
  expect(
    getPercentageOfSuccessfulJobs([
      { id: "j1", status: "success" },
      { id: "j2", status: "post-run" },
      { id: "j3", status: "error" },
    ]),
  ).toBe(33);
});
