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

import { createSelector } from "reselect";
import _ from "lodash";
import { getTimezone } from "../CurrentUser/selectors";
import { fromNow } from "../Date";

export const getRemotecisById = state => state.remotecis2.byId;
export const getRemotecisAllIds = state => state.remotecis2.allIds;
export const getRemotecis = createSelector(
  getTimezone,
  getRemotecisById,
  getRemotecisAllIds,
  (timezone, remotecis, remotecisAllIds) =>
    _.sortBy(
      remotecisAllIds.map(id => {
        const remoteci = remotecis[id];
        return {
          ...remoteci,
          from_now: fromNow(remoteci.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
