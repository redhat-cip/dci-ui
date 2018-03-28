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
import * as constants from "./constants";

test("set currentUser", t => {
  const newState = reducer(undefined, {
    type: constants.SET_CURRENT_USER,
    payload: {
      email: "currentUser@example.org",
      role: {
        label: "USER"
      }
    }
  });
  t.is(newState.email, "currentUser@example.org");
});

test("set SUPER_ADMIN role shortcut", t => {
  const newState = reducer(undefined, {
    type: constants.SET_CURRENT_USER,
    payload: {
      email: "currentUser@example.org",
      role: {
        label: "SUPER_ADMIN"
      }
    }
  });
  t.is(newState.email, "currentUser@example.org");
  t.true(newState.hasProductOwnerRole);
  t.true(newState.hasAdminRole);
  t.true(newState.hasReadOnlyRole);
});

test("set PRODUCT_OWNER role shortcut", t => {
  const newState = reducer(undefined, {
    type: constants.SET_CURRENT_USER,
    payload: {
      email: "currentUser@example.org",
      role: {
        label: "PRODUCT_OWNER"
      }
    }
  });
  t.is(newState.email, "currentUser@example.org");
  t.true(newState.hasProductOwnerRole);
  t.true(newState.hasAdminRole);
  t.true(newState.hasReadOnlyRole);
});

test("set ADMIN role shortcut", t => {
  const newState = reducer(undefined, {
    type: constants.SET_CURRENT_USER,
    payload: {
      email: "currentUser@example.org",
      role: {
        label: "ADMIN"
      }
    }
  });
  t.is(newState.email, "currentUser@example.org");
  t.false(newState.hasProductOwnerRole);
  t.true(newState.hasAdminRole);
  t.false(newState.hasReadOnlyRole);
});

test("set READ_ONLY_USER role shortcut", t => {
  const newState = reducer(undefined, {
    type: constants.SET_CURRENT_USER,
    payload: {
      email: "currentUser@example.org",
      role: {
        label: "READ_ONLY_USER"
      }
    }
  });
  t.is(newState.email, "currentUser@example.org");
  t.false(newState.hasProductOwnerRole);
  t.false(newState.hasAdminRole);
  t.true(newState.hasReadOnlyRole);
});

test("set currentUser unset role shortcut", t => {
  const newState = reducer(
    {
      hasProductOwnerRole: true,
      hasAdminRole: true,
      hasReadOnlyRole: true
    },
    {
      type: constants.SET_CURRENT_USER,
      payload: {
        email: "currentUser@example.org",
        role: {
          label: "READ_ONLY_USER"
        }
      }
    }
  );
  t.is(newState.email, "currentUser@example.org");
  t.false(newState.hasProductOwnerRole);
  t.false(newState.hasAdminRole);
  t.true(newState.hasReadOnlyRole);
});

test("set currentUser SUPER_ADMIN shortcut", t => {
  const newState = reducer(undefined, {
    type: constants.SET_CURRENT_USER,
    payload: {
      email: "currentUser@example.org",
      role: {
        label: "SUPER_ADMIN"
      }
    }
  });
  t.is(newState.email, "currentUser@example.org");
  t.true(newState.isSuperAdmin);
  t.false(newState.isReadOnly);
});

test("set currentUser READ_ONLY_USER shortcut", t => {
  const newState = reducer(undefined, {
    type: constants.SET_CURRENT_USER,
    payload: {
      email: "currentUser@example.org",
      role: {
        label: "READ_ONLY_USER"
      }
    }
  });
  t.is(newState.email, "currentUser@example.org");
  t.false(newState.isSuperAdmin);
  t.true(newState.isReadOnly);
});

test("set currentUser USER shortcut", t => {
  const newState = reducer(undefined, {
    type: constants.SET_CURRENT_USER,
    payload: {
      email: "currentUser@example.org",
      role: {
        label: "USER"
      }
    }
  });
  t.is(newState.email, "currentUser@example.org");
  t.false(newState.isSuperAdmin);
  t.false(newState.isReadOnly);
});
