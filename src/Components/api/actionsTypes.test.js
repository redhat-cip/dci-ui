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
import { createActionsTypes } from "./actionsTypes";

test("fetch all actions types", t => {
  t.is(createActionsTypes("user").FETCH_ALL_REQUEST, "FETCH_USERS_REQUEST");
  t.is(createActionsTypes("user").FETCH_ALL_SUCCESS, "FETCH_USERS_SUCCESS");
  t.is(createActionsTypes("user").FETCH_ALL_FAILURE, "FETCH_USERS_FAILURE");
});

test("fetch one actions types", t => {
  t.is(createActionsTypes("user").FETCH_REQUEST, "FETCH_USER_REQUEST");
  t.is(createActionsTypes("user").FETCH_SUCCESS, "FETCH_USER_SUCCESS");
  t.is(createActionsTypes("user").FETCH_FAILURE, "FETCH_USER_FAILURE");
});

test("create actions types", t => {
  t.is(createActionsTypes("user").CREATE_REQUEST, "CREATE_USER_REQUEST");
  t.is(createActionsTypes("user").CREATE_SUCCESS, "CREATE_USER_SUCCESS");
  t.is(createActionsTypes("user").CREATE_FAILURE, "CREATE_USER_FAILURE");
});

test("update actions types", t => {
  t.is(createActionsTypes("user").UPDATE_REQUEST, "UPDATE_USER_REQUEST");
  t.is(createActionsTypes("user").UPDATE_SUCCESS, "UPDATE_USER_SUCCESS");
  t.is(createActionsTypes("user").UPDATE_FAILURE, "UPDATE_USER_FAILURE");
});

test("delete actions types", t => {
  t.is(createActionsTypes("user").DELETE_REQUEST, "DELETE_USER_REQUEST");
  t.is(createActionsTypes("user").DELETE_SUCCESS, "DELETE_USER_SUCCESS");
  t.is(createActionsTypes("user").DELETE_FAILURE, "DELETE_USER_FAILURE");
});
