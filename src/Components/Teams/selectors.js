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

export const getTeamsById = state => state.teams2.byId;
export const getTeamsAllIds = state => state.teams2.allIds;
export const getTeams = createSelector(
  getTimezone,
  getTeamsById,
  getTeamsAllIds,
  (timezone, teams, teamsAllIds) =>
    _.sortBy(
      teamsAllIds.map(id => {
        const team = teams[id];
        return {
          ...team,
          parent_team: teams[team.parent_id],
          from_now: fromNow(team.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
