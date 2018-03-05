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
import uniqBy from "lodash/uniqBy";

export function dciDate($ngRedux) {
  const currentUser = $ngRedux.getState().currentUser;
  return function(value) {
    const dateUTC = moment.utc(value);
    dateUTC.tz(currentUser.timezone);
    return dateUTC.format("LLL");
  };
}

dciDate.$inject = ["$ngRedux"];

export function dciFromNow($ngRedux) {
  const currentUser = $ngRedux.getState().currentUser;
  return function(value) {
    const dateUTC = moment.utc(value);
    dateUTC.tz(currentUser.timezone);
    return dateUTC.fromNow();
  };
}

dciFromNow.$inject = ["$ngRedux"];

export function dciDateDiffInMin() {
  return function(value1, value2) {
    const date1 = moment.utc(value1);
    const date2 = moment.utc(value2);
    return moment.duration(date2.diff(date1)).humanize();
  };
}

export function msToSec() {
  return function(value) {
    return Math.round(value / 1000);
  };
}

export function unique() {
  return function(elements, field) {
    return uniqBy(elements, field);
  };
}

export function filterGlobalStatus() {
  return function(components, tab) {
    if (tab === "all") {
      return components;
    }
    return components.filter(component => {
      return component.product_name.indexOf(tab) !== -1;
    });
  };
}
