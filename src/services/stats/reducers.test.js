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

test("set stats", t => {
  const newState = reducer(undefined, {
    type: constants.SET_STATS,
    payload: {
      "RH7-RHOS-10.0 2018-02-02.1": {
        topic_name: "OSP10",
        jobs: [{ status: "success" }, { status: "failure" }]
      }
    }
  });
  t.is(newState[0].name, "RH7-RHOS-10.0 2018-02-02.1");
  t.is(newState[0].topic_name, "OSP10");
  t.is(newState[0].percentageOfSuccess, 50);
});

test("set stats order topic", t => {
  const newState = reducer(undefined, {
    type: constants.SET_STATS,
    payload: {
      "RH7-RHOS-10.0 2018-02-02.1": {
        topic_name: "OSP10",
        jobs: [{ status: "success" }, { status: "failure" }]
      },
      "RH7-RHOS-12.0 2018-02-02.1": {
        topic_name: "OSP12",
        jobs: [{ status: "success" }, { status: "failure" }]
      }
    }
  });
  t.is(newState[0].name, "RH7-RHOS-12.0 2018-02-02.1");
  t.is(newState[1].name, "RH7-RHOS-10.0 2018-02-02.1");
});
