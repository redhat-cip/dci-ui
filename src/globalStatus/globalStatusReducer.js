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

import * as constants from "./globalStatusActionsTypes";

export function orderGlobalStatus(stats) {
  const topics = [
    "RDO-Newton",
    "RDO-Ocata",
    "RDO-Pike",
    "RDO-Queens",
    "RDO-Rocky",
    "OSP8",
    "OSP9",
    "OSP10",
    "OSP11",
    "OSP12",
    "OSP13",
    "OSP14"
  ];
  stats
    .sort((stat1, stat2) => {
      const name1 = stat1.topic_name.toLowerCase();
      const name2 = stat2.topic_name.toLowerCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    })
    .sort((stat1, stat2) => {
      const index1 = topics.indexOf(stat1.topic_name);
      const index2 = topics.indexOf(stat2.topic_name);
      return index1 < index2;
    });
  return stats;
}

export default function(state = [], action) {
  switch (action.type) {
    case constants.SET_GLOBAL_STATUS:
      const globalStatus = orderGlobalStatus(action.payload);
      return [...globalStatus];
    default:
      return state;
  }
}
