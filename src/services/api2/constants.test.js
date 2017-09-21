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
import Constants from "./constants";

test("constants", t => {
  t.is(Constants("foo").SET, "SET_FOO");
  t.is(Constants("foos").SET, "SET_FOO");
  t.is(Constants("foo").SET_LIST, "SET_FOOS");
  t.is(Constants("foos").SET_LIST, "SET_FOOS");
  t.is(Constants("foo").CREATE, "CREATE_FOO");
  t.is(Constants("foos").CREATE, "CREATE_FOO");
  t.is(Constants("foo").UPDATE, "UPDATE_FOO");
  t.is(Constants("foos").UPDATE, "UPDATE_FOO");
  t.is(Constants("foo").DELETE, "DELETE_FOO");
  t.is(Constants("foos").DELETE, "DELETE_FOO");
});
