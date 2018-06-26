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

export const getComponentsById = state => state.components2.byId;
export const getComponentsAllIds = state => state.components2.allIds;
export const getComponents = createSelector(
  getTimezone,
  getComponentsById,
  getComponentsAllIds,
  (timezone, components, componentsAllIds) =>
    _.sortBy(
      componentsAllIds.map(id => {
        const component = components[id];
        return {
          ...component,
          parent_component: components[component.parent_id],
          from_now: fromNow(component.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
