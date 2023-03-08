import { DateTime } from "luxon";
import humanize from "humanize-duration";
import { RangeOptionValue } from "types";

export function fromNow(
  dateString: string,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) {
  return DateTime.fromISO(dateString, { zone: "utc" })
    .setZone(timezone)
    .toRelative();
}

export function humanizeDuration(
  durationInMs: number | null,
  option: humanize.Options = {}
) {
  if (durationInMs === null) return "0 seconds";
  return humanize(durationInMs, { round: true, largest: 1, ...option });
}

export function formatDate(
  datetime: string | DateTime,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  format = DateTime.DATETIME_MED_WITH_SECONDS
) {
  let _datetime: DateTime;
  if (typeof datetime === "string") {
    _datetime = DateTime.fromISO(datetime, { zone: "utc" });
  } else {
    _datetime = datetime;
  }
  return _datetime.setZone(timezone).toLocaleString(format);
}

export const humanizeDurationShort = humanize.humanizer({
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

export function getRangeDates(range: RangeOptionValue, now?: string) {
  const today = now ? DateTime.fromISO(now) : DateTime.now();
  const yesterday = today.minus({
    day: 1,
  });
  if (range === "today") {
    return {
      after: today.startOf("day").toISODate(),
      before: today.endOf("day").toISODate(),
    };
  }
  if (range === "currentWeek") {
    return {
      after: today.startOf("week").toISODate(),
      before: today.endOf("week").toISODate(),
    };
  }
  if (range === "currentMonth") {
    return {
      after: today.startOf("month").toISODate(),
      before: today.endOf("month").toISODate(),
    };
  }
  if (range === "currentQuarter") {
    return {
      after: today.startOf("quarter").toISODate(),
      before: today.endOf("quarter").toISODate(),
    };
  }
  if (range === "currentYear") {
    return {
      after: today.startOf("year").toISODate(),
      before: today.endOf("year").toISODate(),
    };
  }
  if (range === "yesterday") {
    return {
      after: yesterday.startOf("day").toISODate(),
      before: yesterday.endOf("day").toISODate(),
    };
  }
  if (range === "previousWeek") {
    const lastWeek = today.minus({
      week: 1,
    });
    return {
      after: lastWeek.startOf("week").toISODate(),
      before: lastWeek.endOf("week").toISODate(),
    };
  }
  if (range === "previousMonth") {
    const lastMonth = today.minus({
      month: 1,
    });
    return {
      after: lastMonth.startOf("month").toISODate(),
      before: lastMonth.endOf("month").toISODate(),
    };
  }
  if (range === "previousQuarter") {
    const lastQuarter = today.minus({
      quarter: 1,
    });
    return {
      after: lastQuarter.startOf("quarter").toISODate(),
      before: lastQuarter.endOf("quarter").toISODate(),
    };
  }
  if (range === "lastMonth") {
    const lastMonth = today.minus({
      month: 1,
    });
    return {
      after: lastMonth.startOf("month").toISODate(),
      before: lastMonth.endOf("month").toISODate(),
    };
  }
  if (range === "lastYear") {
    const lastYear = today.minus({
      year: 1,
    });
    return {
      after: lastYear.startOf("year").toISODate(),
      before: lastYear.endOf("year").toISODate(),
    };
  }
  if (range === "last7Days") {
    const last7Days = today.minus({
      days: 7,
    });
    return {
      after: last7Days.startOf("day").toISODate(),
      before: today.endOf("day").toISODate(),
    };
  }
  if (range === "last30Days") {
    const last30Days = today.minus({
      days: 30,
    });
    return {
      after: last30Days.startOf("day").toISODate(),
      before: today.endOf("day").toISODate(),
    };
  }
  if (range === "last90Days") {
    const last90Days = today.minus({
      days: 90,
    });
    return {
      after: last90Days.startOf("day").toISODate(),
      before: today.endOf("day").toISODate(),
    };
  }
  if (range === "last365Days") {
    const last365Days = today.minus({
      days: 365,
    });
    return {
      after: last365Days.startOf("day").toISODate(),
      before: today.endOf("day").toISODate(),
    };
  }
  return {
    after: "",
    before: "",
  };
}
