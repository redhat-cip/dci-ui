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

import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import uiBootstrap from "angular-ui-bootstrap";
import ngRedux from "ng-redux";
import ngReduxRouter from "redux-ui-router";
import "./favicon.ico";
import routes, { transition as routesAuthTransition } from "./routes";
import "./app.scss";
import adminUsersPage from "./pages/admin/users";
import adminUserEditPage from "./pages/admin/users/edit";
import adminUserCreatePage from "./pages/admin/users/create";
import adminUserForm from "./pages/admin/users/form";
import adminTeamsPage from "./pages/admin/teams";
import adminTeamEditPage from "./pages/admin/teams/edit";
import adminTeamCreatePage from "./pages/admin/teams/create";
import adminTeamForm from "./pages/admin/teams/form";
import adminTopicsPage from "./pages/admin/topics";
import adminTopicEditPage from "./pages/admin/topics/edit";
import adminTopicCreatePage from "./pages/admin/topics/create";
import adminRemotecisPage from "./pages/admin/remotecis";
import adminRemoteciEditPage from "./pages/admin/remotecis/edit";
import adminRemoteciCreatePage from "./pages/admin/remotecis/create";
import jobsPage from "./pages/jobs";
import jobStatesPage from "./pages/job/jobstates";
import jobTestsPage from "./pages/job/tests";
import jobIssuesPage from "./pages/job/issues";
import jobFilesPage from "./pages/job/files";
import componentsPage from "./pages/components";
import loginPage from "./pages/login";
import updatePasswordPage from "./pages/settings/updatePassword";
import updateSettingsPage from "./pages/settings/updateSettings";
import notificationPage from "./pages/settings/notification";
import metricsPage from "./pages/metrics";
import globalStatusPage from "./pages/globalStatus";
import Menu from "./components/menu";
import topicMetricsSummary from "./components/topic-metric-summary";
import topicMetricsGraph from "./components/topic-metric-graph";
import Loading from "./components/loading";
import JobSummary from "./components/job-summary";
import Alerts from "./components/alerts";
import Title from "./components/title";
import ConfirmDestructiveAction from "./components/confirmDestructiveAction";
import store from "./store";
import * as configActions from "./services/config/actions";
import * as authActions from "./services/auth/actions";
import * as filters from "./filters";
import * as directives from "./directives";

angular
  .module("app", [uiRouter, ngRedux, ngReduxRouter, uiBootstrap])
  .config(store)
  .run([
    "$ngRedux",
    $ngRedux => {
      $ngRedux.dispatch(configActions.setConfig(window.__DCI_CONFIG));
      $ngRedux.dispatch(authActions.checkUserIsAuthenticated());
    }
  ])
  .config(routes)
  .run(routesAuthTransition)
  .filter("dciDate", filters.dciDate)
  .filter("dciFromNow", filters.dciFromNow)
  .filter("dciDateDiffInMin", filters.dciDateDiffInMin)
  .filter("msToSec", filters.msToSec)
  .filter("unique", filters.unique)
  .directive("jsonText", directives.jsonText)
  .component("dciMenu", Menu)
  .component("dciLoading", Loading)
  .component("dciAlerts", Alerts)
  .component("jobSummary", JobSummary)
  .component("dciTitle", Title)
  .component("topicMetricsSummary", topicMetricsSummary)
  .component("confirmDestructiveAction", ConfirmDestructiveAction)
  .component("loginPage", loginPage)
  .component("jobsPage", jobsPage)
  .component("jobStatesPage", jobStatesPage)
  .component("jobFilesPage", jobFilesPage)
  .component("jobTestsPage", jobTestsPage)
  .component("jobIssuesPage", jobIssuesPage)
  .component("componentsPage", componentsPage)
  .component("adminUsersPage", adminUsersPage)
  .component("adminUserEditPage", adminUserEditPage)
  .component("adminUserCreatePage", adminUserCreatePage)
  .component("adminUserForm", adminUserForm)
  .component("adminTeamsPage", adminTeamsPage)
  .component("adminTeamEditPage", adminTeamEditPage)
  .component("adminTeamCreatePage", adminTeamCreatePage)
  .component("adminTeamForm", adminTeamForm)
  .component("adminTopicsPage", adminTopicsPage)
  .component("adminTopicEditPage", adminTopicEditPage)
  .component("adminTopicCreatePage", adminTopicCreatePage)
  .component("adminRemotecisPage", adminRemotecisPage)
  .component("adminRemoteciEditPage", adminRemoteciEditPage)
  .component("adminRemoteciCreatePage", adminRemoteciCreatePage)
  .component("globalStatusPage", globalStatusPage)
  .component("metricsPage", metricsPage)
  .component("topicMetricsGraph", topicMetricsGraph)
  .component("updatePasswordPage", updatePasswordPage)
  .component("updateSettingsPage", updateSettingsPage)
  .component("notificationPage", notificationPage);
