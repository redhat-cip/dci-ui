// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import moment from "moment-timezone/builds/moment-timezone-with-data-2012-2022";
import objectValues from "object.values";

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
