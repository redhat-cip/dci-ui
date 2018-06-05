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
import reducer from "./JobsReducer";
import * as types from "./JobsActionsTypes";

test("JobsReducer initial state", t => {
  t.deepEqual(reducer(undefined, {}), {
    byId: {},
    allIds: [],
    isFetching: false,
    loaded: false
  });
});

test("FETCH_JOBS_PENDING", t => {
  const state = reducer(undefined, {
    type: types.FETCH_JOBS_PENDING
  });
  t.true(state.isFetching);
  t.false(state.loaded);
});

test("FETCH_JOBS_PENDING reset isFetching and loaded", t => {
  const state = reducer(
    {
      isFetching: false,
      loaded: true
    },
    {
      type: types.FETCH_JOBS_PENDING
    }
  );
  t.true(state.isFetching);
  t.false(state.loaded);
});

test("FETCH_JOBS_SUCCESS empty jobs", t => {
  t.deepEqual(
    reducer(undefined, {
      type: types.FETCH_JOBS_SUCCESS,
      payload: []
    }),
    {
      byId: {},
      allIds: [],
      isFetching: false,
      loaded: true
    }
  );
});

test("FETCH_JOBS_SUCCESS reset isFetching and loaded", t => {
  const state = reducer(
    {
      byId: {},
      allIds: [],
      isFetching: true,
      loaded: false
    },
    {
      type: types.FETCH_JOBS_SUCCESS,
      payload: []
    }
  );
  t.false(state.isFetching);
  t.true(state.loaded);
});
