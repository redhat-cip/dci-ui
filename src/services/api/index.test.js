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

import test from 'ava';
import nock from 'nock';
import api from './index';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import constants from "./constants";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test("creates FETCH_USERS_REQUEST FETCH_USERS_SUCCESS when fetching users has been done", t => {
  nock('https://api.example.org/api/v1').get('/users')
    .reply(200, {users: [{id: 'u1'}]});
  const expectedActions = [
    {type: constants('user').FETCH_REQUEST},
    {type: constants('user').FETCH_SUCCESS, payload: [{id: 'u1'}]}
  ];
  const store = mockStore({config: {apiURL: "https://api.example.org"}});
  return store.dispatch(api('user').all()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("creates FETCH_USERS_SUCCESS when sync", t => {
  nock('https://api.example.org/api/v1').get('/users')
    .reply(200, {users: [{id: 'u1'}]});
  const expectedActions = [
    {type: constants('user').FETCH_SUCCESS, payload: [{id: 'u1'}]}
  ];
  const store = mockStore({config: {apiURL: "https://api.example.org"}});
  return store.dispatch(api('user').sync()).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("creates FETCH_USERS_FAILURE when fetching returns 401", t => {
  const error = {"_status": "Unauthorized", "message": "Please login with proper credentials."};
  nock('https://api.example.org/api/v1').get('/users')
    .reply(401, error);
  const expectedActions = [
    {type: constants('user').FETCH_REQUEST},
    {type: constants('user').FETCH_FAILURE, payload: error, error: true}
  ];
  const store = mockStore({config: {apiURL: "https://api.example.org"}});
  return store.dispatch(api('user').all()).catch(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("creates SET_USER when fetching a user has been done", t => {
  nock('https://api.example.org/api/v1').get('/users/u1')
    .reply(200, {user: {id: 'u1'}});
  const expectedActions = [
    {type: constants('user').SET, payload: {id: 'u1'}}
  ];
  const store = mockStore({config: {apiURL: "https://api.example.org"}});
  return store.dispatch(api('user').get({id: 'u1'})).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("creates CREATE_USER when user is created", t => {
  nock('https://api.example.org/api/v1').post('/users', {name: 'Name'})
    .reply(201, {user: {id: 'u2', name: 'Name'}});
  const expectedActions = [
    {type: constants('user').CREATED, payload: {id: 'u2', name: 'Name'}}
  ];
  const store = mockStore({config: {apiURL: "https://api.example.org"}});
  return store.dispatch(api('user').post({name: 'Name'})).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("creates UPDATE_USER when user is updated", t => {
  nock('https://api.example.org/api/v1').put('/users/u1', {name: 'New name'})
    .reply(200, {id: 'u1', name: 'New name'}, {'etag': '2'});
  const expectedActions = [
    {type: constants('user').UPDATED, payload: {id: 'u1', name: 'New name', 'etag': '2'}}
  ];
  const store = mockStore({config: {apiURL: "https://api.example.org"}});
  return store.dispatch(api('user').put({id: 'u1', name: 'New name', etag: '1'})).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("creates DELETE_USER when a user is deleted", t => {
  nock('https://api.example.org/api/v1').delete('/users/u1')
    .reply(204);
  const expectedActions = [
    {type: constants('user').DELETED, payload: {id: 'u1', etag: ''}}
  ];
  const store = mockStore({config: {apiURL: "https://api.example.org"}});
  return store.dispatch(api('user').delete({id: 'u1', etag: ''})).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});
