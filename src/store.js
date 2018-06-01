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
import { connect } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import currentUserReducer from "./services/currentUser/reducers";
import configReducer from "./services/config/reducers";
import alertsReducer from "./components/Alert/AlertsReducer";
import globalStatusReducer from "./services/globalStatus/reducers";
import TopicReducer from "./services/topic/reducers";
import Reducers from "./services/api/reducers";
import teamReducer from "./services/team/reducer";
import { router as RouterReducer } from "redux-ui-router";
import thunk from "redux-thunk";

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
  router: RouterReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

export function configureStore($ngReduxProvider) {
  return $ngReduxProvider.provideStore(store, ["ngUiRouterMiddleware"]);
}

configureStore.$inject = ["$ngReduxProvider"];

export function connectWithStore(WrappedComponent, ...args) {
  var ConnectedWrappedComponent = connect(...args)(WrappedComponent);
  return function(props) {
    return <ConnectedWrappedComponent {...props} store={store} />;
  };
}
