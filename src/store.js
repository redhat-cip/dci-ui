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

import { router } from "redux-ui-router";
import thunk from "redux-thunk";
import authReducer from "./services/auth/reducers";
import metricsReducer from "./services/metrics/reducers";
import currentUserReducer from "./services/currentUser/reducers";
import configReducer from "./services/config/reducers";
import alertsReducer from "./services/alerts/reducers";
import api from "./services/api";

const store = function($ngReduxProvider) {
  const reducers = {
    currentUser: currentUserReducer,
    auth: authReducer,
    config: configReducer,
    metrics: metricsReducer,
    jobs: api("job").reducer,
    users: api("user").reducer,
    teams: api("team").reducer,
    roles: api("role").reducer,
    topics: api("topic").reducer,
    fingerprints: api("fingerprint").reducer,
    remotecis: api("remoteci").reducer,
    products: api("product").reducer,
    alerts: alertsReducer,
    router
  };
  const middleware = ["ngUiRouterMiddleware", thunk];
  return $ngReduxProvider.createStoreWith(reducers, middleware);
};

store.$inject = ["$ngReduxProvider"];

export default store;
