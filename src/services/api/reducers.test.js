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
  t.deepEqual(newState, {
    isFetching: false,
    item: null,
    items: []
  });
});

test("request foos set isFetching", t => {
  const newState = reducer("foo")(
    {
      isFetching: false
    },
    {
      type: constants("foo").FETCH_REQUEST
    }
  );
  t.true(newState.isFetching);
});

test("fetch failure reset isFetching", t => {
  const newState = reducer("foo")(
    {
      isFetching: true
    },
    {
      type: constants("foo").FETCH_FAILURE
    }
  );
  t.false(newState.isFetching);
});

test("set foos", t => {
  const newState = reducer("foo")(
    {
      isFetching: true,
      items: []
    },
    {
      type: constants("foo").FETCH_SUCCESS,
      payload: [{ id: "1" }, { id: "2" }]
    }
  );
  t.false(newState.isFetching);
  t.is(newState.items.length, 2);
});

test("delete foo", t => {
  const newState = reducer("foo")(
    {
      isFetching: false,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    },
    {
      type: constants("foo").DELETED,
      payload: { id: 1 }
    }
  );
  t.false(newState.isFetching);
  t.is(newState.items.length, 3);
  t.is(newState.items[0].id, 2);
});

test("update foo", t => {
  const newState = reducer("foo")(
    {
      isFetching: false,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    },
    {
      type: constants("foo").UPDATED,
      payload: { id: 1, name: "id 1" }
    }
  );
  t.is(newState.items[0].name, "id 1");
});

test("set foo", t => {
  const newState = reducer("foo")(
    {
      item: null
    },
    {
      type: constants("foo").SET,
      payload: { id: 1, name: "id 1" }
    }
  );
  t.is(newState.item.name, "id 1");
});

test("set foo enhance if id same", t => {
  const newState = reducer("foo")(
    {
      item: { id: 1, name: "id 1", files: [{}, {}] }
    },
    {
      type: constants("foo").SET,
      payload: { id: 1, files: [{}] }
    }
  );
  t.is(newState.item.name, "id 1");
  t.is(newState.item.files.length, 1);
});

test("set foo replace if id different", t => {
  const newState = reducer("foo")(
    {
      item: { id: 1, name: "id 1" }
    },
    {
      type: constants("foo").SET,
      payload: { id: 2, files: [{}, {}] }
    }
  );
  t.is(newState.item.name, undefined);
  t.is(newState.item.files.length, 2);
});

test("create foo add in foos", t => {
  const newState = reducer("foo")(
    {
      items: []
    },
    {
      type: constants("foo").CREATED,
      payload: { id: 1 }
    }
  );
  t.is(newState.items[0].id, 1);
});
