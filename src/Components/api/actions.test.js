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

test("fetch jobs", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs")
    .reply(200, { jobs: [{ id: "j1" }] });
  const expectedActions = [
    { type: types.jobs.FETCH_REQUEST },
    {
      type: types.jobs.FETCH_SUCCESS,
      result: ["j1"],
      entities: {
        jobs: { j1: { id: "j1" } }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(actions.jobs.all()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetch users params", t => {
  const params = { embed: "team,role" };
  nock("https://api.example.org/api/v1")
    .get("/users")
    .query(params)
    .reply(200, { users: [] });
  const expectedActions = [
    { type: types.users.FETCH_REQUEST },
    {
      type: types.users.FETCH_SUCCESS,
      result: [],
      entities: {}
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(actions.users.all(params)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetch error", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs")
    .reply(401, {
      message: "Authorization header missing",
      status_code: 401
    });
  const expectedActions = [
    { type: types.jobs.FETCH_REQUEST },
    {
      type: types.jobs.FETCH_FAILURE,
      message: "Authorization header missing"
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(actions.jobs.all()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetch error no message", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs")
    .reply(500);
  const expectedActions = [
    { type: types.jobs.FETCH_REQUEST },
    {
      type: types.jobs.FETCH_FAILURE,
      message: "Something went wrong"
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(actions.jobs.all()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetch job", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs/j1")
    .reply(200, { job: { id: "j1" } });
  const expectedActions = [
    { type: types.job.FETCH_REQUEST },
    {
      type: types.job.FETCH_SUCCESS,
      result: "j1",
      entities: {
        jobs: { j1: { id: "j1" } }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(actions.jobs.one({ id: "j1" })).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});
