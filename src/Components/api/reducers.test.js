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
import { jobsReducer } from "./reducers";
import * as types from "./actionsTypes";

test("jobsReducer initial state", t => {
  t.deepEqual(jobsReducer(undefined, {}), {
    byId: {},
    allIds: [],
    errorMessage: null,
    isFetching: false
  });
});

test("FETCH_REQUEST", t => {
  const state = jobsReducer(undefined, {
    type: types.jobs.FETCH_REQUEST
  });
  t.true(state.isFetching);
});

test("FETCH_SUCCESS", t => {
  const state = jobsReducer(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: types.jobs.FETCH_SUCCESS,
      result: ["j1"],
      entities: {
        jobs: { j1: { id: "j1" } }
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

test("FETCH_FAILURE", t => {
  const state = jobsReducer(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: types.jobs.FETCH_FAILURE,
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

test("fetch another reducer with updated entity", t => {
  const state = jobsReducer(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: types.users.FETCH_SUCCESS,
      result: ["u1"],
      entities: {
        users: { u1: { id: "u1" } },
        jobs: { j2: { id: "j2" } }
      }
    }
  );
  const expectedState = {
    byId: { j1: { id: "j1" }, j2: { id: "j2" } },
    allIds: ["j1", "j2"],
    errorMessage: null,
    isFetching: false
  };
  t.deepEqual(state, expectedState);
});

test("fetch one entity", t => {
  const state = jobsReducer(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: types.job.FETCH_SUCCESS,
      result: "j2",
      entities: {
        jobs: { j2: { id: "j2" } }
      }
    }
  );
  const expectedState = {
    byId: { j1: { id: "j1" }, j2: { id: "j2" } },
    allIds: ["j1", "j2"],
    errorMessage: null,
    isFetching: false
  };
  t.deepEqual(state, expectedState);
});
