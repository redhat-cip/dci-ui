import { DateTime } from "luxon";
import humanize from "humanize-duration";

export function fromNow(dateString) {
  return DateTime.fromISO(dateString).toRelative();
}

export function humanizeDuration(durationInSeconds) {
  return humanize(durationInSeconds * 1000, { round: true, largest: 1 });
}

export function formatDate(datetime) {
  return DateTime.fromISO(datetime).toLocaleString(
    DateTime.DATETIME_MED_WITH_SECONDS
  );
}
