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

import test from "ava";
import reducer from "./reducers";
import * as constants from "./constants";

test("FETCH_SUCCESS", t => {
  const newState = reducer(
    {
      isFetching: false,
      items: []
    },
    {
      type: constants.FETCH_SUCCESS,
      payload: {
        A: [
          {
            component: "A 2017-06-23 7c38f7c",
            date: "2017-06-26T07:34:17.742097",
            values: []
          },
          {
            component: "A 2017-06-29 0c31f31",
            date: "2017-06-30T11:22:39.187551",
            values: [25646, 27386, 68846]
          }
        ],
        O: [
          {
            component: "O 2017-06-28 b1e0f78",
            date: "2017-07-01T15:35:14.784047",
            values: []
          }
        ]
      }
    }
  );
  const expectedItems = [
    {
      name: "A",
      components: [
        {
          component: "A 2017-06-23 7c38f7c",
          date: "2017-06-26T07:34:17.742097",
          values: []
        },
        {
          component: "A 2017-06-29 0c31f31",
          date: "2017-06-30T11:22:39.187551",
          values: [25646, 27386, 68846]
        }
      ]
    },
    {
      name: "O",
      components: [
        {
          component: "O 2017-06-28 b1e0f78",
          date: "2017-07-01T15:35:14.784047",
          values: []
        }
      ]
    }
  ];
  t.deepEqual(newState.items, expectedItems);
});

test("SELECT_FIRST_METRIC", t => {
  const newState = reducer(
    {
      isFetching: false,
      items: [{ name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }]
    },
    {
      type: constants.SELECT_FIRST_METRIC
    }
  );
  t.is(newState.item.name, newState.items[0].name);
});

test("GET_METRIC", t => {
  const newState = reducer(
    {
      isFetching: false,
      items: [{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }]
    },
    {
      type: constants.GET_METRIC,
      payload: {
        name: "c"
      }
    }
  );
  t.is(newState.item.name, "c");
});

test("FILTER_METRIC", t => {
  const last3Months = 3;
  const newState = reducer(
    {
      item: {
        name: 1,
        components: [
          {
            component: "RH7-RHOS-10.0 2016-11-10.1",
            date: "2016-11-10T00:00:00.000Z",
            values: []
          },
          {
            component: "RH7-RHOS-10.0 2016-11-20.1",
            date: "2016-11-20T00:00:00.000Z",
            values: []
          }
        ]
      }
    },
    {
      type: constants.FILTER_METRIC,
      payload: {
        range: last3Months,
        now: new Date(2017, 1, 15)
      }
    }
  );
  t.is(newState.item.components.length, 1);
  t.is(newState.item.components[0].component, "RH7-RHOS-10.0 2016-11-20.1");
});

test("FILTER_METRIC range -1", t => {
  const newState = reducer(
    {
      item: {
        name: 1,
        components: [{}, {}]
      }
    },
    {
      type: constants.FILTER_METRIC,
      payload: {
        range: -1
      }
    }
  );
  t.is(newState.item.components.length, 2);
});
