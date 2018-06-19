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

import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import currentUserReducer from "./services/currentUser/reducers";
import configReducer from "./services/config/reducers";
import alertsReducer from "./Components/Alerts/AlertsReducer";
import { createReducer } from "./Components/api/reducers";
import globalStatusReducer from "./services/globalStatus/reducers";
import TopicReducer from "./services/topic/reducers";
import Reducers from "./services/api/reducers";
import teamReducer from "./services/team/reducer";
import { router as RouterReducer } from "redux-ui-router";
import thunk from "redux-thunk";
import createConnect from "redux-connect-standalone";

export const rootReducer = combineReducers({
  alerts: alertsReducer,
  globalStatus: globalStatusReducer,
  currentUser: currentUserReducer,
  config: configReducer,
  jobs: Reducers("job"),
  jobs2: createReducer("job"),
  users: Reducers("user"),
  users2: createReducer("user"),
  teams: Reducers("team"),
  teams2: createReducer("team"),
  team: teamReducer,
  roles: Reducers("role"),
  roles2: createReducer("role"),
  topics: Reducers("topic"),
  topics2: createReducer("topic"),
  topic: TopicReducer,
  remotecis: Reducers("remoteci"),
  remotecis2: createReducer("remoteci"),
  feeders: Reducers("feeder"),
  feeders2: createReducer("feeder"),
  products: Reducers("product"),
  products2: createReducer("product"),
  components: Reducers("component"),
  components2: createReducer("component"),
  results2: createReducer("result"),
  rconfigurations2: createReducer("rconfiguration"),
  jobstates2: createReducer("jobstate"),
  router: RouterReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

export function configureStore($ngReduxProvider) {
  return $ngReduxProvider.provideStore(store, ["ngUiRouterMiddleware"]);
}

configureStore.$inject = ["$ngReduxProvider"];

export const connect = createConnect(store);