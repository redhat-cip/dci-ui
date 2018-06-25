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
import ProductsReducer from "./Components/Products/reducer";
import RemotecisReducer from "./Components/Remotecis/reducer";
import TopicsReducer from "./Components/Topics/reducer";
import FeedersReducer from "./Components/Feeders/reducer";
import ComponentsReducer from "./Components/Components/reducer";
import TeamsReducer from "./Components/Teams/reducer";
import RolesReducer from "./Components/Roles/reducer";
import UsersReducer from "./Components/Users/reducer";
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
  users: Reducers("user"),
  teams: Reducers("team"),
  team: teamReducer,
  roles: Reducers("role"),
  topics: Reducers("topic"),
  topic: TopicReducer,
  remotecis: Reducers("remoteci"),
  feeders: Reducers("feeder"),
  products: Reducers("product"),
  components: Reducers("component"),
  router: RouterReducer,
  feeders2: FeedersReducer,
  remotecis2: RemotecisReducer,
  products2: ProductsReducer,
  topics2: TopicsReducer,
  components2: ComponentsReducer,
  teams2: TeamsReducer,
  users2: UsersReducer,
  roles2: RolesReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

export function configureStore($ngReduxProvider) {
  return $ngReduxProvider.provideStore(store, ["ngUiRouterMiddleware"]);
}

configureStore.$inject = ["$ngReduxProvider"];

export const connect = createConnect(store);
