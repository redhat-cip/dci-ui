import { DateTime } from "luxon";
import humanize from "humanize-duration";
import { TimeRange } from "types";

export function fromNow(dateString: string) {
  return DateTime.fromISO(dateString, { zone: "utc" }).toRelative();
}

const humanizeDurationShort = humanize.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});

export function humanizeDuration(
  duration: number | null,
  option: humanize.Options = {},
) {
  const durationInMs = (duration || 0) * 1000;
  return humanizeDurationShort(durationInMs, {
    delimiter: " ",
    round: true,
    largest: 1,
    ...option,
  });
}

export function formatDate(
  datetime: string | DateTime,
  format = DateTime.DATETIME_MED_WITH_SECONDS,
) {
  let _datetime: DateTime;
  if (typeof datetime === "string") {
    _datetime = DateTime.fromISO(datetime, { zone: "utc" });
  } else {
    _datetime = datetime;
  }
  return _datetime.toLocaleString(format);
}

export function getRangeDates(range: TimeRange, now?: string) {
  const today = now ? DateTime.fromISO(now) : DateTime.now();
  const yesterday = today.minus({
    day: 1,
  });
  let after: string | null = "";
  let before: string | null = "";
  if (range === "today") {
    after = today.startOf("day").toISODate();
    before = today.endOf("day").toISODate();
  }
  if (range === "currentWeek") {
    after = today.startOf("week").toISODate();
    before = today.endOf("week").toISODate();
  }
  if (range === "currentMonth") {
    after = today.startOf("month").toISODate();
    before = today.endOf("month").toISODate();
  }
  if (range === "currentQuarter") {
    after = today.startOf("quarter").toISODate();
    before = today.endOf("quarter").toISODate();
  }
  if (range === "currentYear") {
    after = today.startOf("year").toISODate();
    before = today.endOf("year").toISODate();
  }
  if (range === "yesterday") {
    after = yesterday.startOf("day").toISODate();
    before = yesterday.endOf("day").toISODate();
  }
  if (range === "previousWeek") {
    const lastWeek = today.minus({
      week: 1,
    });
    after = lastWeek.startOf("week").toISODate();
    before = lastWeek.endOf("week").toISODate();
  }
  if (range === "previousMonth") {
    const lastMonth = today.minus({
      month: 1,
    });
    after = lastMonth.startOf("month").toISODate();
    before = lastMonth.endOf("month").toISODate();
  }
  if (range === "previousQuarter") {
    const lastQuarter = today.minus({
      quarter: 1,
    });
    after = lastQuarter.startOf("quarter").toISODate();
    before = lastQuarter.endOf("quarter").toISODate();
  }
  if (range === "lastMonth") {
    const lastMonth = today.minus({
      month: 1,
    });
    after = lastMonth.startOf("month").toISODate();
    before = lastMonth.endOf("month").toISODate();
  }
  if (range === "lastYear") {
    const lastYear = today.minus({
      year: 1,
    });
    after = lastYear.startOf("year").toISODate();
    before = lastYear.endOf("year").toISODate();
  }
  if (range === "last7Days") {
    const last7Days = today.minus({
      days: 7,
    });
    after = last7Days.startOf("day").toISODate();
    before = today.endOf("day").toISODate();
  }
  if (range === "last30Days") {
    const last30Days = today.minus({
      days: 30,
    });
    after = last30Days.startOf("day").toISODate();
    before = today.endOf("day").toISODate();
  }
  if (range === "last90Days") {
    const last90Days = today.minus({
      days: 90,
    });
    after = last90Days.startOf("day").toISODate();
    before = today.endOf("day").toISODate();
  }
  if (range === "last365Days") {
    const last365Days = today.minus({
      days: 365,
    });
    after = last365Days.startOf("day").toISODate();
    before = today.endOf("day").toISODate();
  }
  return {
    after: after || "",
    before: before || "",
  };
}
