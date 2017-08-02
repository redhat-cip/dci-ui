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
import find from "lodash/find";

const initialState = {
  isFetching: false,
  didInvalidate: false,
  items: [],
  item: null
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case constants.FETCH_SUCCESS:
      const filteredMetrics = [];
      for (let metric in action.payload) {
        filteredMetrics.push({
          name: metric,
          components: action.payload[metric]
        });
      }
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: filteredMetrics
      });
    case constants.FETCH_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: true
      });
    case constants.SELECT_FIRST_METRIC:
      return Object.assign({}, state, {
        item: Object.assign({}, state.items[0])
      });
    case constants.GET_METRIC:
      return Object.assign({}, state, {
        item: find(state.items, item => item.name === action.payload.name)
      });
    case constants.FILTER_METRIC:
      if (action.payload.range === -1) {
        return state;
      }
      const now =
        typeof action.payload.now === "undefined"
          ? new Date()
          : action.payload.now;
      const monthAgo = new Date(now.getTime());
      monthAgo.setMonth(monthAgo.getMonth() - action.payload.range);
      const item = Object.assign({}, state.item, {
        components: state.item.components.filter(component => {
          const componentDate = new Date(component.date);
          return componentDate > monthAgo;
        })
      });
      return Object.assign({}, state, { item });
    default:
      return state;
  }
}
