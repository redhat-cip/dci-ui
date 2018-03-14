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
import axios from "axios";
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
import adminProductsPage from "./pages/admin/products";
import adminProductEditPage from "./pages/admin/products/edit";
import adminProductCreatePage from "./pages/admin/products/create";
import adminRemotecisPage from "./pages/admin/remotecis";
import adminRemoteciEditPage from "./pages/admin/remotecis/edit";
import adminRemoteciCreatePage from "./pages/admin/remotecis/create";
import adminFeedersPage from "./pages/admin/feeders";
import adminFeederEditPage from "./pages/admin/feeders/edit";
import adminFeederCreatePage from "./pages/admin/feeders/create";
import jobsPage from "./pages/jobs";
import jobMenu from "./pages/jobs/menu";
import jobStatesPage from "./pages/jobs/jobstates";
import jobTestsPage from "./pages/jobs/tests";
import jobIssuesPage from "./pages/jobs/issues";
import jobFilesPage from "./pages/jobs/files";
import jobCertificationPage from "./pages/jobs/certification";
import topicsPage from "./pages/topics";
import topicCreatePage from "./pages/topics/create";
import topicEditPage from "./pages/topics/edit";
import topicForm from "./pages/topics/form";
import componentsPage from "./pages/components";
import loginPage from "./pages/login";
import settingsMenu from "./pages/settings/menu";
import updatePasswordPage from "./pages/settings/updatePassword";
import updateSettingsPage from "./pages/settings/updateSettings";
import notificationPage from "./pages/settings/notification";
import globalStatusPage from "./pages/globalStatus";
import Menu from "./components/menu";
import Masthead from "./components/masthead";
import Loading from "./components/loading";
import JobSummary from "./components/job-summary";
import Alerts from "./components/alerts";
import Title from "./components/title";
import CopyButton from "./components/copyButton";
import ConfirmDestructiveAction from "./components/confirmDestructiveAction";
import noTeamWarning from "./components/noTeamWarning";
import store from "./store";
import { setConfig } from "./services/config/actions";
import { initCurrentUser } from "./services/currentUser/actions";
import { refreshJWT } from "./services/auth";
import { createSSO, initSSO, KeycloakFactory } from "./services/sso";
import * as filters from "./filters";
import * as directives from "./directives";

angular
  .module("app", [uiRouter, ngRedux, ngReduxRouter, uiBootstrap])
  .config(store)
  .config(routes)
  .run(routesAuthTransition)
  .filter("dciDate", filters.dciDate)
  .filter("dciFromNow", filters.dciFromNow)
  .filter("dciDateDiffInMin", filters.dciDateDiffInMin)
  .filter("msToSec", filters.msToSec)
  .filter("unique", filters.unique)
  .filter("filterGlobalStatus", filters.filterGlobalStatus)
  .filter("humanFileSize", filters.humanFileSize)
  .directive("jsonText", directives.jsonText);

angular.element(document).ready(function() {
  axios.get("config.json").then(response => {
    const config = response.data;
    window._sso = createSSO(config.sso);
    angular
      .module("app")
      .factory("keycloak", KeycloakFactory)
      .run(["$ngRedux", $ngRedux => $ngRedux.dispatch(setConfig(config))])
      .run(initCurrentUser)
      .run(refreshJWT)
      .component("dciMenu", Menu)
      .component("dciMasthead", Masthead)
      .component("dciLoading", Loading)
      .component("dciAlerts", Alerts)
      .component("jobSummary", JobSummary)
      .component("copyButton", CopyButton)
      .component("dciTitle", Title)
      .component("confirmDestructiveAction", ConfirmDestructiveAction)
      .component("noTeamWarning", noTeamWarning)
      .component("loginPage", loginPage)
      .component("jobsPage", jobsPage)
      .component("jobMenu", jobMenu)
      .component("jobStatesPage", jobStatesPage)
      .component("jobTestsPage", jobTestsPage)
      .component("jobIssuesPage", jobIssuesPage)
      .component("jobFilesPage", jobFilesPage)
      .component("jobCertificationPage", jobCertificationPage)
      .component("topicsPage", topicsPage)
      .component("topicCreatePage", topicCreatePage)
      .component("topicEditPage", topicEditPage)
      .component("topicForm", topicForm)
      .component("componentsPage", componentsPage)
      .component("adminUsersPage", adminUsersPage)
      .component("adminUserEditPage", adminUserEditPage)
      .component("adminUserCreatePage", adminUserCreatePage)
      .component("adminUserForm", adminUserForm)
      .component("adminTeamsPage", adminTeamsPage)
      .component("adminTeamEditPage", adminTeamEditPage)
      .component("adminTeamCreatePage", adminTeamCreatePage)
      .component("adminTeamForm", adminTeamForm)
      .component("adminProductsPage", adminProductsPage)
      .component("adminProductEditPage", adminProductEditPage)
      .component("adminProductCreatePage", adminProductCreatePage)
      .component("adminRemotecisPage", adminRemotecisPage)
      .component("adminRemoteciEditPage", adminRemoteciEditPage)
      .component("adminRemoteciCreatePage", adminRemoteciCreatePage)
      .component("adminFeedersPage", adminFeedersPage)
      .component("adminFeederEditPage", adminFeederEditPage)
      .component("adminFeederCreatePage", adminFeederCreatePage)
      .component("globalStatusPage", globalStatusPage)
      .component("settingsMenu", settingsMenu)
      .component("updatePasswordPage", updatePasswordPage)
      .component("updateSettingsPage", updateSettingsPage)
      .component("notificationPage", notificationPage);

    initSSO(window._sso).then(() => {
      angular.bootstrap(document, ["app"]);
    });
  });
});
