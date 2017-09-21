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
import reducer from "./reducers";
import constants from "./constants";

test("return the initial state", t => {
  const newState = reducer("foo")(undefined, {});
  t.deepEqual(newState, {});
});

test("return the initial state array", t => {
  const newState = reducer("foos")(undefined, {});
  t.deepEqual(newState, []);
});

test("set foos", t => {
  const newState = reducer("foos")([], {
    type: constants("foo").SET_LIST,
    payload: [{ id: "f1" }, { id: "f2" }]
  });
  t.is(newState.length, 2);
});

test("set foo", t => {
  const newState = reducer("foo")(
    {},
    {
      type: constants("foo").SET,
      payload: { id: "f1" }
    }
  );
  t.is(newState.id, "f1");
});

test("set foo enhance if id same", t => {
  const newState = reducer("foo")(
    { id: "f1", name: "foo 1", files: [{}, {}] },
    {
      type: constants("foo").SET,
      payload: { id: "f1", files: [{}] }
    }
  );
  t.is(newState.name, "foo 1");
  t.is(newState.files.length, 1);
});

test("create foo append in foos", t => {
  const newState = reducer("foo")([{ id: "f1" }], {
    type: constants("foo").CREATE,
    payload: { id: "f2" }
  });
  t.is(newState[0].id, "f1");
  t.is(newState[1].id, "f2");
});

test("update foo", t => {
  const newState = reducer("foo")([{ id: "f1" }, { id: "f2" }, { id: "f3" }], {
    type: constants("foo").UPDATE,
    payload: { id: "f2", name: "foo 2" }
  });
  t.is(newState.length, 3);
  t.is(newState[1].name, "foo 2");
});

test("delete foo", t => {
  const newState = reducer("foo")([{ id: "f1" }, { id: "f2" }, { id: "f3" }], {
    type: constants("foo").DELETE,
    payload: { id: "f2" }
  });
  t.is(newState.length, 2);
  t.is(newState[0].id, "f1");
  t.is(newState[1].id, "f3");
});
