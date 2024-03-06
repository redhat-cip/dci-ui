import * as date from "./date";

test("humanizeDuration", () => {
  expect(date.humanizeDuration(0)).toBe("0 seconds");
  expect(date.humanizeDuration(60 * 1000)).toBe("1 minute");
  expect(date.humanizeDuration(61 * 1000)).toBe("1 minute");
  expect(date.humanizeDuration(null)).toBe("0 seconds");
  expect(date.humanizeDuration(28958 * 1000)).toBe("8 hours");
});

test("formatDate", () => {
  // Replace \u202f space issue https://github.com/nodejs/node/issues/46123
  expect(
    date.formatDate("2018-06-14T15:30:39.139451").replace("\u202f", " "),
  ).toBe(`Jun 14, 2018, 3:30:39 PM`);
});

test("getRangeDates", () => {
  const now = "2023-03-09";
  expect(date.getRangeDates("previousWeek", now)).toEqual({
    after: "2023-02-27",
    before: "2023-03-05",
  });
  expect(date.getRangeDates("previousMonth", now)).toEqual({
    after: "2023-02-01",
    before: "2023-02-28",
  });
  expect(date.getRangeDates("previousQuarter", now)).toEqual({
    after: "2022-10-01",
    before: "2022-12-31",
  });
  expect(date.getRangeDates("lastMonth", now)).toEqual({
    after: "2023-02-01",
    before: "2023-02-28",
  });
  expect(date.getRangeDates("lastYear", now)).toEqual({
    after: "2022-01-01",
    before: "2022-12-31",
  });
  expect(date.getRangeDates("yesterday", now)).toEqual({
    after: "2023-03-08",
    before: "2023-03-08",
  });
  expect(date.getRangeDates("today", now)).toEqual({
    after: "2023-03-09",
    before: "2023-03-09",
  });
  expect(date.getRangeDates("currentWeek", now)).toEqual({
    after: "2023-03-06",
    before: "2023-03-12",
  });
  expect(date.getRangeDates("currentMonth", now)).toEqual({
    after: "2023-03-01",
    before: "2023-03-31",
  });
  expect(date.getRangeDates("currentQuarter", now)).toEqual({
    after: "2023-01-01",
    before: "2023-03-31",
  });
  expect(date.getRangeDates("currentYear", now)).toEqual({
    after: "2023-01-01",
    before: "2023-12-31",
  });
  expect(date.getRangeDates("last7Days", now)).toEqual({
    after: "2023-03-02",
    before: "2023-03-09",
  });
  expect(date.getRangeDates("last30Days", now)).toEqual({
    after: "2023-02-07",
    before: "2023-03-09",
  });
  expect(date.getRangeDates("last90Days", now)).toEqual({
    after: "2022-12-09",
    before: "2023-03-09",
  });
  expect(date.getRangeDates("last365Days", now)).toEqual({
    after: "2022-03-09",
    before: "2023-03-09",
  });
  expect(date.getRangeDates("custom", now)).toEqual({
    after: "",
    before: "",
  });
});
