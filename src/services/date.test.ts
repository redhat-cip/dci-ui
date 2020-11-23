import * as date from "./date";

it("humanizeDuration", () => {
  expect(date.humanizeDuration(0)).toBe("0 seconds");
  expect(date.humanizeDuration(60 * 1000)).toBe("1 minute");
  expect(date.humanizeDuration(61 * 1000)).toBe("1 minute");
  expect(date.humanizeDuration(null)).toBe("0 seconds");
  expect(date.humanizeDuration(28958 * 1000)).toBe("8 hours");
});

it("formatDate", () => {
  expect(date.formatDate("2018-06-14T15:30:39.139451")).toBe(
    "Jun 14, 2018, 3:30:39 PM"
  );
});
