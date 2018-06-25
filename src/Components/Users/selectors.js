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
import { getTeamsById } from "../Teams/selectors";
import { getRolesById } from "../Roles/selectors";
import { fromNow } from "../Date";

export const getUsersById = state => state.users2.byId;
export const getUsersAllIds = state => state.users2.allIds;
export const getUsers = createSelector(
  getTimezone,
  getUsersById,
  getTeamsById,
  getRolesById,
  getUsersAllIds,
  (timezone, users, teams, roles, usersAllIds) =>
    _.sortBy(
      usersAllIds.map(id => {
        const user = users[id];
        return {
          ...user,
          team: teams[user.team_id],
          role: roles[user.role_id],
          from_now: fromNow(user.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
