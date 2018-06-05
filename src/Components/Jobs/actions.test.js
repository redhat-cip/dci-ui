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
import nock from "nock";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "./actions";
import * as types from "./actionsTypes";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test("fetchJobs", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs")
    .reply(200, { jobs: [{ id: "j1" }] });
  const expectedActions = [
    { type: types.FETCH_JOBS_REQUEST },
    {
      type: types.FETCH_JOBS_SUCCESS,
      response: {
        result: ["j1"],
        entities: {
          jobs: { j1: { id: "j1" } }
        }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(actions.fetchJobs()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetchJobs error", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs")
    .reply(401, {
      message: "Authorization header missing",
      status_code: 401
    });
  const expectedActions = [
    { type: types.FETCH_JOBS_REQUEST },
    {
      type: types.FETCH_JOBS_FAILURE,
      message: "Authorization header missing"
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(actions.fetchJobs()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetchJobs error no message", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs")
    .reply(500);
  const expectedActions = [
    { type: types.FETCH_JOBS_REQUEST },
    {
      type: types.FETCH_JOBS_FAILURE,
      message: "Something went wrong"
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(actions.fetchJobs()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});
