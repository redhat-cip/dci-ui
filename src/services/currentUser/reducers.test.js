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

test("set currentUser set role shortcut", t => {
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
  t.true(newState.isSuperAdminOrProductOwner);
});

test("set currentUser unset role shortcut", t => {
  const newState = reducer(
    { isSuperAdmin: true, isSuperAdminOrProductOwner: true },
    {
      type: constants.SET_CURRENT_USER,
      payload: {
        email: "currentUser@example.org",
        role: {
          label: "PRODUCT_OWNER"
        }
      }
    }
  );
  t.is(newState.email, "currentUser@example.org");
  t.false(newState.isSuperAdmin);
  t.true(newState.isSuperAdminOrProductOwner);
});

test("set currentUser set isAdmin role shortcut", t => {
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
  t.false(newState.isSuperAdmin);
  t.false(newState.isSuperAdminOrProductOwner);
  t.true(newState.isAdmin);
});
