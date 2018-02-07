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

import * as constants from "./constants";

export function order(stats) {
  const topicsOrder = {
    OSP12: 1,
    OSP11: 2,
    OSP10: 3,
    OSP9: 4,
    OSP8: 5,
    "RDO-Pike": 6,
    "RDO-Ocata": 7,
    "RDO-Newton": 8
  };
  stats.sort((s1, s2) => {
    const t1Order = topicsOrder[s1.topic_name] || 9;
    const t2Order = topicsOrder[s2.topic_name] || 9;
    return t1Order > t2Order;
  });
}

function getPercentage(jobs) {
  let success = 0;
  jobs.forEach(job => {
    if (job.status === "success") {
      success += 1;
    }
  });
  return Math.round(success * 100 / jobs.length);
}

export default function(state = [], action) {
  switch (action.type) {
    case constants.SET_STATS:
      const stats = [];
      const globalStatus = action.payload;
      Object.keys(globalStatus).forEach(componentName => {
        const component = globalStatus[componentName];
        const percentageOfSuccess = getPercentage(component["jobs"]);
        stats.push(
          Object.assign({}, component, {
            name: componentName,
            percentageOfSuccess
          })
        );
      });
      order(stats);
      return [...state, ...stats];
    default:
      return state;
  }
}
