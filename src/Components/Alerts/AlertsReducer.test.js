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
import reducer from "./AlertsReducer";
import * as types from "./AlertsActionsTypes";

test("AlertsReducer initial state", t => {
  t.deepEqual(reducer(undefined, {}), {});
});

test("SHOW_ALERT", t => {
  t.deepEqual(
    reducer(undefined, {
      type: types.SHOW_ALERT,
      alert: {
        id: "a1"
      }
    }),
    {
      a1: {
        id: "a1"
      }
    }
  );
});

test("SHOW_ALERT keep existing alerts", t => {
  t.deepEqual(
    reducer(
      {
        a1: {
          id: "a1"
        }
      },
      {
        type: types.SHOW_ALERT,
        alert: {
          id: "a2"
        }
      }
    ),
    {
      a1: {
        id: "a1"
      },
      a2: {
        id: "a2"
      }
    }
  );
});

test("HIDE_ALERT", t => {
  t.deepEqual(
    reducer(
      {
        a1: {
          id: "a1"
        },
        a2: {
          id: "a2"
        }
      },
      {
        type: types.HIDE_ALERT,
        alert: {
          id: "a1"
        }
      }
    ),
    {
      a2: {
        id: "a2"
      }
    }
  );
});
