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
import adminUserEditPage from "./pages/admin/users/edit";
import adminUserCreatePage from "./pages/admin/users/create";
import adminUserForm from "./pages/admin/users/form";
import adminTeamEditPage from "./pages/admin/teams/edit";
import adminTeamCreatePage from "./pages/admin/teams/create";
import adminTeamForm from "./pages/admin/teams/form";
import ProductsScreen from "./Screens/Products";
import FeedersScreen from "./Screens/Feeders";
import RemotecisScreen from "./Screens/Remotecis";
import TopicsScreen from "./Screens/Topics";
import ComponentsScreen from "./Screens/Components";
import TeamsScreen from "./Screens/Teams";
import UsersScreen from "./Screens/Users";
import productEditPage from "./pages/products/edit";
import productCreatePage from "./pages/products/create";
import remoteciEditPage from "./pages/remotecis/edit";
import remoteciCreatePage from "./pages/remotecis/create";
import feederEditPage from "./pages/feeders/edit";
import feederCreatePage from "./pages/feeders/create";
import jobsPage from "./pages/jobs";
import jobMenu from "./pages/jobs/menu";
import jobStatesPage from "./pages/jobs/jobstates";
import jobTestsPage from "./pages/jobs/tests";
import jobIssuesPage from "./pages/jobs/issues";
import jobFilesPage from "./pages/jobs/files";
import jobCertificationPage from "./pages/jobs/certification";
import topicCreatePage from "./pages/topics/create";
import topicEditPage from "./pages/topics/edit";
import topicDetailsPage from "./pages/topics/details";
import topicForm from "./pages/topics/form";
import loginPage from "./pages/login";
import settingsMenu from "./pages/settings/menu";
import updatePasswordPage from "./pages/settings/updatePassword";
import updateSettingsPage from "./pages/settings/updateSettings";
import notificationPage from "./pages/settings/notification";
import globalStatusPage from "./pages/globalStatus";
import Menu from "./components/menu";
import Masthead from "./components/masthead";
import Loading from "./components/loading";
import JobSummary from "./Components/Jobs/JobSummary";
import Alerts from "./Components/Alerts";
import Title from "./Components/Title";
import TitleCard from "./components/title-card";
import CopyButton from "./Components/CopyButton";
import ConfirmDestructiveAction from "./components/confirmDestructiveAction";
import noTeamWarning from "./components/noTeamWarning";
import store, { configureStore } from "./store";
import { getConfig } from "./services/config/actions";
import { getCurrentUser } from "./services/currentUser/actions";
import { configureSSO, refreshJWT } from "./services/sso";
import * as filters from "./filters";
import * as directives from "./directives";
import { react2angular } from "react2angular";

angular.element(document).ready(function() {
  store
    .dispatch(getConfig())
    .then(config => store.dispatch(configureSSO(config)))
    .then(() => store.dispatch(getCurrentUser()))
    .catch(error => console.error(error))
    .then(() => {
      angular
        .module("app", [uiRouter, ngRedux, ngReduxRouter, uiBootstrap])
        .config(configureStore)
        .config(routes)
        .run(routesAuthTransition)
        .run(refreshJWT)
        .filter("dciDate", filters.dciDate)
        .filter("dciFromNow", filters.dciFromNow)
        .filter("dciDateDiffInMin", filters.dciDateDiffInMin)
        .filter("msToSec", filters.msToSec)
        .filter("unique", filters.unique)
        .filter("filterGlobalStatus", filters.filterGlobalStatus)
        .filter("humanFileSize", filters.humanFileSize)
        .directive("jsonText", directives.jsonText)
        .component("dciMenu", Menu)
        .component("dciMasthead", Masthead)
        .component("dciLoading", Loading)
        .component("titleCard", TitleCard)
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
        .component("topicCreatePage", topicCreatePage)
        .component("topicEditPage", topicEditPage)
        .component("topicDetailsPage", topicDetailsPage)
        .component("topicForm", topicForm)
        .component("adminUserEditPage", adminUserEditPage)
        .component("adminUserCreatePage", adminUserCreatePage)
        .component("adminUserForm", adminUserForm)
        .component("adminTeamEditPage", adminTeamEditPage)
        .component("adminTeamCreatePage", adminTeamCreatePage)
        .component("adminTeamForm", adminTeamForm)
        .component("productEditPage", productEditPage)
        .component("productCreatePage", productCreatePage)
        .component("remoteciEditPage", remoteciEditPage)
        .component("remoteciCreatePage", remoteciCreatePage)
        .component("feederEditPage", feederEditPage)
        .component("feederCreatePage", feederCreatePage)
        .component("globalStatusPage", globalStatusPage)
        .component("settingsMenu", settingsMenu)
        .component("updatePasswordPage", updatePasswordPage)
        .component("updateSettingsPage", updateSettingsPage)
        .component("notificationPage", notificationPage)
        .component("dciAlerts", react2angular(Alerts))
        .component("jobSummary", react2angular(JobSummary, ["job", "go"]))
        .component("copyButton", react2angular(CopyButton))
        .component("dciTitle", react2angular(Title))
        .component("usersScreen", react2angular(UsersScreen))
        .component("teamsScreen", react2angular(TeamsScreen))
        .component("topicsScreen", react2angular(TopicsScreen))
        .component("productsScreen", react2angular(ProductsScreen))
        .component("remotecisScreen", react2angular(RemotecisScreen))
        .component("feedersScreen", react2angular(FeedersScreen))
        .component("componentsScreen", react2angular(ComponentsScreen));
      angular.bootstrap(document, ["app"]);
    });
});
