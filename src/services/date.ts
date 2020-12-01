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

export function humanizeDuration(durationInMs: number) {
  return humanize(durationInMs, { round: true, largest: 1 });
}

export function formatDate(
  datetime: string,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) {
  return DateTime.fromISO(datetime, { zone: "utc" })
    .setZone(timezone)
    .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}
