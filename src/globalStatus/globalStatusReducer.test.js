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

import reducer, { orderGlobalStatus } from "./globalStatusReducer";
import * as types from "./globalStatusActionsTypes";

it("set stats", () => {
  const newState = reducer(undefined, {
    type: types.SET_GLOBAL_STATUS,
    payload: [
      {
        name: "RH7-RHOS-10.0 2018-02-02.1",
        topic_name: "OSP10",
        jobs: [{ status: "success" }, { status: "failure" }]
      }
    ]
  });
  expect(newState[0].name).toBe("RH7-RHOS-10.0 2018-02-02.1");
  expect(newState[0].topic_name).toBe("OSP10");
});

it("set stats order topic", () => {
  const newState = reducer(undefined, {
    type: types.SET_GLOBAL_STATUS,
    payload: [
      {
        name: "RH7-RHOS-10.0 2018-02-02.1",
        topic_name: "OSP10",
        jobs: [{ status: "success" }, { status: "failure" }]
      },
      {
        name: "RH7-RHOS-12.0 2018-02-02.1",
        topic_name: "OSP12",
        jobs: [{ status: "success" }, { status: "failure" }]
      }
    ]
  });
  expect(newState[0].name).toBe("RH7-RHOS-12.0 2018-02-02.1");
  expect(newState[1].name).toBe("RH7-RHOS-10.0 2018-02-02.1");
});

it("order stats order topic also by name", () => {
  const orderedStats = orderGlobalStatus([
    { topic_name: "OSP12" },
    { topic_name: "Ansible-devel" },
    { topic_name: "Ansible-2.4" }
  ]);

  expect(orderedStats[0].topic_name).toBe("OSP12");
  expect(orderedStats[1].topic_name).toBe("Ansible-2.4");
  expect(orderedStats[2].topic_name).toBe("Ansible-devel");
});
