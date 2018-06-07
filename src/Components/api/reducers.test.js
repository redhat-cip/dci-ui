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
import { createReducer } from "./reducers";
import { createActionsTypes } from "./actionsTypes";

const jobActionsTypes = createActionsTypes("job");
const userActionsTypes = createActionsTypes("user");

test("reducer initial state", t => {
  t.deepEqual(createReducer("job")(undefined, {}), {
    byId: {},
    allIds: [],
    errorMessage: null,
    isFetching: false
  });
});

test("FETCH_REQUEST", t => {
  const state = createReducer("job")(undefined, {
    type: jobActionsTypes.FETCH_ALL_REQUEST
  });
  t.true(state.isFetching);
});

test("FETCH_SUCCESS", t => {
  const state = createReducer("job")(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: jobActionsTypes.FETCH_ALL_SUCCESS,
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
  const state = createReducer("job")(
    {
      byId: {},
      allIds: [],
      errorMessage: null,
      isFetching: true
    },
    {
      type: jobActionsTypes.FETCH_ALL_FAILURE,
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
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: userActionsTypes.FETCH_ALL_SUCCESS,
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
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: jobActionsTypes.FETCH_SUCCESS,
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

test("update one entity", t => {
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1", etag: "e1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: jobActionsTypes.UPDATE_SUCCESS,
      result: "j1",
      entities: {
        jobs: { j1: { id: "j1", etag: "e2" } }
      }
    }
  );
  const expectedState = {
    byId: { j1: { id: "j1", etag: "e2" } },
    allIds: ["j1"],
    errorMessage: null,
    isFetching: false
  };
  t.deepEqual(state, expectedState);
});

test("delete one entity", t => {
  const state = createReducer("job")(
    {
      byId: { j1: { id: "j1" } },
      allIds: ["j1"],
      errorMessage: null,
      isFetching: false
    },
    {
      type: jobActionsTypes.DELETE_SUCCESS,
      id: "j1"
    }
  );
  const expectedState = {
    byId: {},
    allIds: [],
    errorMessage: null,
    isFetching: false
  };
  t.deepEqual(state, expectedState);
});
