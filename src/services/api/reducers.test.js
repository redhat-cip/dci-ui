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
import api from "services/api";

test("return the initial state", t => {
  const reducer = api("foo").reducer;
  const newState = reducer(undefined, {});
  t.deepEqual(newState, {
    isFetching: false,
    didInvalidate: false,
    item: null,
    items: []
  });
});

test("request foos set isFetching", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      isFetching: false
    },
    {
      type: foo.constants.FETCH_REQUEST
    }
  );
  t.true(newState.isFetching);
});

test("request foos unset didInvalidate", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      didInvalidate: true
    },
    {
      type: foo.constants.FETCH_REQUEST
    }
  );
  t.false(newState.didInvalidate);
});

test("invalidate foos", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      didInvalidate: false
    },
    {
      type: foo.constants.FETCH_FAILURE
    }
  );
  t.true(newState.didInvalidate);
});

test("invalidate foos reset loading", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      isFetching: true
    },
    {
      type: foo.constants.FETCH_FAILURE
    }
  );
  t.false(newState.isFetching);
});

test("set foos", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    {
      type: foo.constants.FETCH_SUCCESS,
      payload: [{ id: "1" }, { id: "2" }]
    }
  );
  t.false(newState.isFetching);
  t.false(newState.didInvalidate);
  t.is(newState.items.length, 2);
});

test("delete foo", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      isFetching: false,
      didInvalidate: false,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    },
    {
      type: foo.constants.DELETED,
      payload: { id: 1 }
    }
  );
  t.false(newState.isFetching);
  t.false(newState.didInvalidate);
  t.is(newState.items.length, 3);
  t.is(newState.items[0].id, 2);
});

test("update foo", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      isFetching: false,
      didInvalidate: false,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    },
    {
      type: foo.constants.UPDATED,
      payload: { id: 1, name: "id 1" }
    }
  );
  t.is(newState.items[0].name, "id 1");
});

test("set foo", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      item: null
    },
    {
      type: foo.constants.SET,
      payload: { id: 1, name: "id 1" }
    }
  );
  t.is(newState.item.name, "id 1");
});

test("set foo enhance if id same", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      item: { id: 1, name: "id 1", files: [{}, {}] }
    },
    {
      type: foo.constants.SET,
      payload: { id: 1, files: [{}] }
    }
  );
  t.is(newState.item.name, "id 1");
  t.is(newState.item.files.length, 1);
});

test("set foo replace if id different", t => {
  const foo = api("foo");
  const newState = foo.reducer(
    {
      item: { id: 1, name: "id 1" }
    },
    {
      type: foo.constants.SET,
      payload: { id: 2, files: [{}, {}] }
    }
  );
  t.is(newState.item.name, undefined);
  t.is(newState.item.files.length, 2);
});
