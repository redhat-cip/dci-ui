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
import { fromNow } from "../Date";

export const getProductsById = state => state.products2.byId;
export const getProductsAllIds = state => state.products2.allIds;
export const getProducts = createSelector(
  getTimezone,
  getTeamsById,
  getProductsById,
  getProductsAllIds,
  (timezone, teams, products, productsAllIds) =>
    _.sortBy(
      productsAllIds.map(id => {
        const product = products[id];
        return {
          ...product,
          team: teams[product.team_id],
          from_now: fromNow(product.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
