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

test("send alert", t => {
  const newState = reducer(undefined, {
    type: constants.SEND_ALERT,
    payload: {
      message: "error",
      type: "error"
    }
  });
  t.is(newState[0].message, "error");
  t.is(newState[0].type, "error");
});

test("close alert", t => {
  const newState = reducer([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], {
    type: constants.CLOSE_ALERT,
    payload: {
      id: 2
    }
  });
  t.is(newState.length, 3);
  t.is(newState[0].id, 1);
  t.is(newState[1].id, 3);
});
