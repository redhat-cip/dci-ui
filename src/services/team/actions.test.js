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
import nock from "nock";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "./actions";
import * as types from "./actionTypes";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test("setTeam action", t => {
  const team = {
    id: "1"
  };
  const expectedAction = {
    type: types.SET_TEAM,
    team
  };
  t.deepEqual(actions.setTeam(team), expectedAction);
});

test("filterAvailableTopics action", t => {
  const topics = [{ id: "topic1" }, { id: "topic2" }];
  const expectedAction = {
    type: types.FILTER_AVAILABLE_TOPICS,
    topics
  };
  t.deepEqual(actions.filterAvailableTopics(topics), expectedAction);
});

test("getTeam filter available topics", t => {
  const team = { id: "team1" };
  nock("https://api.example.org/api/v1")
    .get(`/teams/${team.id}?embed=topics`)
    .reply(200, { team: { id: "team1", name: "Team 1" } });
  const expectedActions = [
    {
      type: types.SET_TEAM,
      team: { id: "team1", name: "Team 1" }
    },
    {
      type: types.FILTER_AVAILABLE_TOPICS,
      topics: [{ id: "topic1" }, { id: "topic2" }]
    }
  ];
  const store = mockStore({
    config: { apiURL: "https://api.example.org" },
    topics: [{ id: "topic1" }, { id: "topic2" }]
  });
  return store.dispatch(actions.getTeam(team)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("associateTopicToTeam action", t => {
  const topic = { id: "topic1" };
  const team = { id: "team1" };
  nock("https://api.example.org/api/v1")
    .post(`/topics/${topic.id}/teams`, { team_id: team.id })
    .reply(201, { team_id: "team1", topic_id: "topic1" });
  nock("https://api.example.org/api/v1")
    .get(`/teams/${team.id}?embed=topics`)
    .reply(200, {
      team: { id: "team1", name: "Team 1", topics: [{ id: "topic1" }] }
    });
  const expectedActions = [
    {
      type: types.SET_TEAM,
      team: { id: "team1", name: "Team 1", topics: [{ id: "topic1" }] }
    },
    {
      type: types.FILTER_AVAILABLE_TOPICS,
      topics: [{ id: "topic1" }, { id: "topic2" }]
    }
  ];
  const store = mockStore({
    config: { apiURL: "https://api.example.org" },
    topics: [{ id: "topic1" }, { id: "topic2" }]
  });
  return store.dispatch(actions.associateTopicToTeam(topic, team)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});

test("removeTopicFromTeam action", t => {
  const topic = { id: "topic1" };
  const team = { id: "team2", etag: "etag" };
  nock("https://api.example.org/api/v1", {
    reqheaders: { "If-Match": team.etag }
  })
    .delete(`/topics/${topic.id}/teams/${team.id}`)
    .reply(204);
  nock("https://api.example.org/api/v1")
    .get(`/teams/${team.id}?embed=topics`)
    .reply(200, { team: { id: "team2", name: "Team 2", topics: [] } });
  const expectedActions = [
    {
      type: types.SET_TEAM,
      team: { id: "team2", name: "Team 2", topics: [] }
    },
    {
      type: types.FILTER_AVAILABLE_TOPICS,
      topics: [{ id: "topic1" }, { id: "topic2" }]
    }
  ];
  const store = mockStore({
    config: { apiURL: "https://api.example.org" },
    topics: [{ id: "topic1" }, { id: "topic2" }]
  });
  return store.dispatch(actions.removeTopicFromTeam(topic, team)).then(() => {
    t.deepEqual(store.getActions(), expectedActions);
  });
});
