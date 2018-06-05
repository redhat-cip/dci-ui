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
import reducer from "./reducer";
import * as types from "./actionsTypes";

test("JobsReducer initial state", t => {
  t.deepEqual(reducer(undefined, {}), {
    byId: {},
    allIds: [],
    errorMessage: null,
    isFetching: false
  });
});

test("FETCH_JOBS_REQUEST", t => {
  const state = reducer(undefined, {
    type: types.FETCH_JOBS_REQUEST
  });
  t.true(state.isFetching);
});

test("FETCH_JOBS_SUCCESS", t => {
  const state = reducer(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: types.FETCH_JOBS_SUCCESS,
      response: {
        result: ["j1"],
        entities: {
          jobs: { j1: { id: "j1" } }
        }
      }
    }
  );
  const expectedState = {
    byId: { j1: { id: "j1" } },
    allIds: ["j1"],
    errorMessage: null,
    isFetching: false
  };
  t.deepEqual(state, expectedState);
});

test("FETCH_JOBS_FAILURE", t => {
  const state = reducer(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: types.FETCH_JOBS_FAILURE,
      message: "Authorization header missing"
    }
  );
  const expectedState = {
    byId: {},
    allIds: [],
    errorMessage: "Authorization header missing",
    isFetching: false
  };
  t.deepEqual(state, expectedState);
});
