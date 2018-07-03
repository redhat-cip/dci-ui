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
import api from "./index";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import constants from "./constants";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test("GET_USERS > 200 > SET_USERS > GET_USERS_SUCCESS", t => {
  nock("https://api.example.org/api/v1")
    .get("/users")
    .reply(200, { users: [{ id: "u1" }] });
  const expectedActions = [
    { type: constants("users").SET, payload: [{ id: "u1" }] }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(api("user").all()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("GET_USERS custom url > 200 > SET_USERS", t => {
  nock("https://api.example.org/api/v1")
    .get("/users/latest")
    .reply(200, { users: [{ id: "u1" }] });
  const expectedActions = [
    { type: constants("users").SET, payload: [{ id: "u1" }] }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store
    .dispatch(api("user").all({ endpoint: "users/latest" }))
    .then(() => {
      t.deepEqual(store.getActions(), expectedActions);
    });
});

test("GET_USER > 200 > UPDATE_USER > GET_USER_SUCCESS", t => {
  nock("https://api.example.org/api/v1")
    .get("/users/u1")
    .reply(200, { user: { id: "u1", name: "u1" } });
  const expectedActions = [
    { type: constants("user").UPDATE, payload: { id: "u1", name: "u1" } }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(api("user").get({ id: "u1" })).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("creates CREATE_USER when user is created", t => {
  nock("https://api.example.org/api/v1")
    .post("/users", { name: "user 2" })
    .reply(201, { user: { id: "u2", name: "user 2" } });
  const expectedActions = [
    { type: constants("user").CREATE, payload: { id: "u2", name: "user 2" } }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store.dispatch(api("user").post({ name: "user 2" })).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("creates user clean api payload", t => {
  nock("https://api.example.org/api/v1")
    .filteringRequestBody(data => {
      t.is(data, '{"name":"user 2"}');
      return data;
    })
    .post("/users", { name: "user 2" })
    .reply(201, { user: { id: "u2", name: "user 2" } });
  const expectedActions = [
    { type: constants("user").CREATE, payload: { id: "u2", name: "user 2" } }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store
    .dispatch(api("user").post({ name: "user 2", team: "", test: null }))
    .then(() => {
      t.deepEqual(store.getActions(), expectedActions);
    });
});

test("creates UPDATE_USER when user is updated", t => {
  nock("https://api.example.org/api/v1")
    .put("/users/u1", { name: "New name" })
    .reply(200, { id: "u1", name: "New name" }, { etag: "e2" });
  const expectedActions = [
    {
      type: constants("user").UPDATE,
      payload: { id: "u1", name: "New name", etag: "e2" }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store
    .dispatch(api("user").put({ id: "u1", name: "New name", etag: "e1" }))
    .then(() => {
      t.deepEqual(store.getActions(), expectedActions);
    });
});

test("update user don't clean null value if in schema", t => {
  // empty answer see https://github.com/redhat-cip/dci-control-server/issues/48
  nock("https://api.example.org/api/v1")
    .filteringRequestBody(data => {
      t.is(data, '{"name":"new topic","next_topic_id":null}');
      return data;
    })
    .put("/topics/t1", { name: "new topic", next_topic_id: null })
    .reply(201, {}, { etag: "e2" });

  const expectedActions = [
    {
      type: constants("topic").UPDATE,
      payload: {
        id: "t1",
        name: "new topic",
        next_topic_id: null,
        unknown_field: null,
        etag: "e2"
      }
    }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store
    .dispatch(
      api("topic").put({
        id: "t1",
        next_topic_id: null,
        unknown_field: null,
        name: "new topic",
        etag: "e1"
      })
    )
    .then(() => {
      t.deepEqual(store.getActions(), expectedActions);
    });
});

test("creates DELETE_USER when a user is deleted", t => {
  nock("https://api.example.org/api/v1")
    .delete("/users/u1")
    .reply(204);
  const expectedActions = [
    { type: constants("user").REMOVE, payload: { id: "u1", etag: "e1" } }
  ];
  const store = mockStore({ config: { apiURL: "https://api.example.org" } });
  return store
    .dispatch(api("user").delete({ id: "u1", etag: "e1" }))
    .then(() => {
      t.deepEqual(store.getActions(), expectedActions);
    });
});

test("create SET_USERS when users are saved", t => {
  const expectedActions = [
    { type: constants("users").SET, payload: [{ id: "u1" }] }
  ];
  const store = mockStore({});
  store.dispatch(api("user").save([{ id: "u1" }]));
  t.deepEqual(store.getActions(), expectedActions);
});
