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
import { createActions } from "./actions";
import { createActionsTypes } from "./actionsTypes";

const usersActions = createActions("user");
const jobsActions = createActions("job");

const jobActionsTypes = createActionsTypes("job");
const userActionsTypes = createActionsTypes("user");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test("fetch jobs", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs")
    .reply(200, { jobs: [{ id: "j1" }] });
  const expectedActions = [
    { type: jobActionsTypes.FETCH_ALL_REQUEST },
    {
      type: jobActionsTypes.FETCH_ALL_SUCCESS,
      result: ["j1"],
      entities: {
        jobs: { j1: { id: "j1" } }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(jobsActions.all()).then(() => {
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
    { type: userActionsTypes.FETCH_ALL_REQUEST },
    {
      type: userActionsTypes.FETCH_ALL_SUCCESS,
      result: [],
      entities: {}
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(usersActions.all(params)).then(() => {
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
    { type: jobActionsTypes.FETCH_ALL_REQUEST },
    {
      type: jobActionsTypes.FETCH_ALL_FAILURE,
      message: "Authorization header missing"
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(jobsActions.all()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetch error no message", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs")
    .reply(500);
  const expectedActions = [
    { type: jobActionsTypes.FETCH_ALL_REQUEST },
    {
      type: jobActionsTypes.FETCH_ALL_FAILURE,
      message: "Something went wrong"
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(jobsActions.all()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetch job", t => {
  nock("https://api.example.org/api/v1")
    .get("/jobs/j1")
    .reply(200, { job: { id: "j1" } });
  const expectedActions = [
    { type: jobActionsTypes.FETCH_REQUEST },
    {
      type: jobActionsTypes.FETCH_SUCCESS,
      result: "j1",
      entities: {
        jobs: { j1: { id: "j1" } }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(jobsActions.one({ id: "j1" })).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("fetch job with params", t => {
  const params = { embed: "team,role" };
  nock("https://api.example.org/api/v1")
    .get("/jobs/j1")
    .query(params)
    .reply(200, { job: { id: "j1" } });
  const expectedActions = [
    { type: jobActionsTypes.FETCH_REQUEST },
    {
      type: jobActionsTypes.FETCH_SUCCESS,
      result: "j1",
      entities: {
        jobs: { j1: { id: "j1" } }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(jobsActions.one({ id: "j1" }, params)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("create one user", t => {
  const user = { name: "user 1" };
  nock("https://api.example.org/api/v1")
    .post("/users", user)
    .reply(201, { user: { id: "u1", name: "user 1" } });
  const expectedActions = [
    { type: userActionsTypes.CREATE_REQUEST },
    {
      type: userActionsTypes.CREATE_SUCCESS,
      result: "u1",
      entities: {
        users: {
          u1: { id: "u1", name: "user 1" }
        }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(usersActions.create(user)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("create one user with params", t => {
  const params = { embed: "team,role" };
  const user = { name: "user 1" };
  nock("https://api.example.org/api/v1")
    .post("/users", user)
    .query(params)
    .reply(201, { user: { id: "u1", name: "user 1" } });
  const expectedActions = [
    { type: userActionsTypes.CREATE_REQUEST },
    {
      type: userActionsTypes.CREATE_SUCCESS,
      result: "u1",
      entities: {
        users: {
          u1: { id: "u1", name: "user 1" }
        }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(usersActions.create(user, params)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("update one user", t => {
  const user = { id: "u1", etag: "eu1" };
  nock("https://api.example.org/api/v1", {
    reqheaders: {
      "If-Match": "eu1"
    }
  })
    .put("/users/u1", user)
    .reply(201, {}, { etag: "eu2" });
  const expectedActions = [
    { type: userActionsTypes.UPDATE_REQUEST },
    {
      type: userActionsTypes.UPDATE_SUCCESS,
      result: "u1",
      entities: {
        users: {
          u1: { id: "u1", etag: "eu2" }
        }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(usersActions.update(user)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("update one user with params", t => {
  const params = { embed: "team,role" };
  const user = { id: "u1", etag: "eu1" };
  nock("https://api.example.org/api/v1", {
    reqheaders: {
      "If-Match": "eu1"
    }
  })
    .put("/users/u1", user)
    .query(params)
    .reply(201, {}, { etag: "eu2" });
  const expectedActions = [
    { type: userActionsTypes.UPDATE_REQUEST },
    {
      type: userActionsTypes.UPDATE_SUCCESS,
      result: "u1",
      entities: {
        users: {
          u1: { id: "u1", etag: "eu2" }
        }
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(usersActions.update(user, params)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("delete one user", t => {
  const user = { id: "u1", etag: "eu1" };
  nock("https://api.example.org/api/v1", {
    reqheaders: {
      "If-Match": "eu1"
    }
  })
    .delete("/users/u1")
    .reply(204);
  const expectedActions = [
    { type: userActionsTypes.DELETE_REQUEST },
    {
      type: userActionsTypes.DELETE_SUCCESS,
      id: "u1"
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(usersActions.delete(user)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});
