import { DateTime } from "luxon";
import humanize from "humanize-duration";

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