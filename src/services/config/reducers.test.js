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

test("return the initial state", t => {
  const newState = reducer(undefined, {});
  t.deepEqual(newState, {
    apiURL: "http://localhost:5000"
  });
});

test("set config", t => {
  const newState = reducer(
    {
      apiURL: "http://localhost:5000"
    },
    {
      type: constants.SET_CONFIG,
      payload: {
        apiURL: "https://api.distributed-ci.io"
      }
    }
  );
  t.deepEqual(newState, {
    apiURL: "https://api.distributed-ci.io"
  });
});
