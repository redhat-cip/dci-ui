import * as date from "./date";

it("fromNow", () => {
  const now = new Date(Date.UTC(2018, 5, 14, 8, 30, 59));
  const timezone = "UTC";
  expect(date.fromNow("2018-06-14T08:20:39.139451", timezone, now)).toBe(
    "10 minutes ago"
  );
});

it("duration", () => {
  expect(
    date.duration("2018-06-14T08:30:39.139451", "2018-06-14T08:20:39.139451")
  ).toBe("10 minutes");
});

it("formatDate", () => {
  const timezone = "America/Los_Angeles";
  expect(date.formatDate("2018-06-14T15:30:39.139451", timezone)).toBe(
    "Jun 14, 2018 8:30 AM"
  );
});
