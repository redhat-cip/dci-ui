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
import { getProductsById } from "../Products/selectors";
import { fromNow } from "../Date";

export const getTopicsById = state => state.topics2.byId;
export const getTopicsAllIds = state => state.topics2.allIds;
export const getTopics = createSelector(
  getTimezone,
  getProductsById,
  getTopicsById,
  getTopicsAllIds,
  (timezone, products, topics, topicsAllIds) =>
    _.sortBy(
      topicsAllIds.map(id => {
        const topic = topics[id];
        return {
          ...topic,
          product: topic.product_id ? products[topic.product_id] : null,
          next_topic: topic.next_topic ? topics[topic.next_topic] : null,
          from_now: fromNow(topic.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
