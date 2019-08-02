import moment from "moment-timezone/builds/moment-timezone-with-data-2012-2022";

export function fromNow(dateString, timezone, now) {
  now = now ? moment(now) : moment();
  const dateUTC = moment.utc(dateString);
  dateUTC.tz(timezone);
  return dateUTC.from(now);
}

export function duration(dateString1, dateString2) {
  const date1 = moment.utc(dateString1);
  const date2 = moment.utc(dateString2);
  return moment.duration(date2.diff(date1)).humanize();
}

export function humanizeDuration(durationInSeconds) {
  return moment.duration(durationInSeconds, "seconds").humanize();
}

export function formatDate(datetime, timezone) {
  return moment
    .utc(datetime)
    .tz(timezone)
    .format("lll");
}
