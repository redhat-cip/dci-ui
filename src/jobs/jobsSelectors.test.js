import { enhanceJob } from "./jobsSelectors";

it("enhanceJob", () => {
  const timezone = "America/Los_Angeles";
  expect(
    enhanceJob(
      {
        id: "j1",
        created_at: "2018-06-14T15:30:39.139451",
        duration: 28812
      },
      timezone
    )
  ).toEqual({
    id: "j1",
    datetime: "Jun 14, 2018 8:30 AM",
    humanizedDuration: "8 hours",
    created_at: "2018-06-14T15:30:39.139451",
    duration: 28812
  });
});
