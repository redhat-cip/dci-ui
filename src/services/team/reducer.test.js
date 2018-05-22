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
import reducer from "./reducer";
import * as types from "./actionTypes";

test("initial team reducer state", t => {
  t.is(reducer(undefined, {}), null);
});

test("set team", t => {
  const newState = reducer(undefined, {
    type: types.SET_TEAM,
    team: {
      name: "DCI"
    }
  });
  t.is(newState.name, "DCI");
});

test("filter available topics", t => {
  const newState = reducer(
    {
      topics: [{ id: "topic2" }],
      availableTopics: []
    },
    {
      type: types.FILTER_AVAILABLE_TOPICS,
      topics: [{ id: "topic1" }, { id: "topic2" }, { id: "topic3" }]
    }
  );
  t.is(newState.availableTopics.length, 2);
  t.is(newState.availableTopics[0].id, "topic1");
  t.is(newState.availableTopics[1].id, "topic3");
});

test("filter available topics use id for unicity", t => {
  const newState = reducer(
    {
      topics: [{ id: "topic2", updated_at: "2018-04-23T10:50:51.345103" }],
      availableTopics: []
    },
    {
      type: types.FILTER_AVAILABLE_TOPICS,
      topics: [{ id: "topic1" }, { id: "topic2" }, { id: "topic3" }]
    }
  );
  t.is(newState.availableTopics.length, 2);
  t.is(newState.availableTopics[0].id, "topic1");
  t.is(newState.availableTopics[1].id, "topic3");
});
