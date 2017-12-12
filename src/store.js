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
import currentUserReducer from "./services/currentUser/reducers";
import configReducer from "./services/config/reducers";
import alertsReducer from "./services/alerts/reducers";
import Reducers from "./services/api/reducers";

const store = function($ngReduxProvider) {
  const reducers = {
    alerts: alertsReducer,
    currentUser: currentUserReducer,
    auth: authReducer,
    config: configReducer,
    jobs: Reducers("job"),
    users: Reducers("user"),
    teams: Reducers("team"),
    roles: Reducers("role"),
    topics: Reducers("topic"),
    remotecis: Reducers("remoteci"),
    feeders: Reducers("feeder"),
    products: Reducers("product"),
    components: Reducers("component"),
    router
  };
  const middleware = ["ngUiRouterMiddleware", thunk];
  return $ngReduxProvider.createStoreWith(reducers, middleware);
};

store.$inject = ["$ngReduxProvider"];

export default store;
