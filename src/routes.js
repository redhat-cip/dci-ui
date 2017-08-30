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

import localStorage from "services/localStorage";

const routes = function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state({
      name: "auth",
      url: "/",
      template:
        '<div><dci-menu></dci-menu><ui-view class="app__main-content"></ui-view></div>',
      abstract: true
    })
    .state({
      name: "login",
      url: "/login",
      component: "loginPage"
    })
    .state({
      name: "auth.jobs",
      url: "jobs",
      component: "jobsPage"
    })
    .state({
      name: "auth.job",
      url: "jobs/:id/",
      abstract: true
    })
    .state({
      name: "auth.job.jobStates",
      url: "jobStates",
      component: "jobStatesPage"
    })
    .state({
      name: "auth.job.tests",
      url: "tests",
      component: "jobTestsPage"
    })
    .state({
      name: "auth.job.files",
      url: "files",
      component: "jobFilesPage"
    })
    .state({
      name: "auth.job.issues",
      url: "issues",
      component: "jobIssuesPage"
    })
    .state({
      name: "auth.components",
      url: "components",
      component: "componentsPage"
    })
    .state({
      name: "auth.settings",
      url: "settings",
      component: "updateSettingsPage"
    })
    .state({
      name: "auth.notification",
      url: "notification",
      component: "notificationPage"
    })
    .state({
      name: "auth.password",
      url: "password",
      component: "updatePasswordPage"
    })
    .state({
      name: "auth.adminUsers",
      url: "admin/users",
      component: "adminUsersPage"
    })
    .state({
      name: "auth.adminUserEdit",
      url: "admin/users/:id",
      component: "adminUserEditPage"
    })
    .state({
      name: "auth.adminUserCreate",
      url: "admin/users/create",
      component: "adminUserCreatePage"
    })
    .state({
      name: "auth.adminTeams",
      url: "admin/teams",
      component: "adminTeamsPage"
    })
    .state({
      name: "auth.adminTeamEdit",
      url: "admin/teams/:id",
      component: "adminTeamEditPage"
    })
    .state({
      name: "auth.adminTeamCreate",
      url: "admin/teams/create",
      component: "adminTeamCreatePage"
    })
    .state({
      name: "auth.adminTopics",
      url: "admin/topics",
      component: "adminTopicsPage"
    })
    .state({
      name: "auth.adminTopicEdit",
      url: "admin/topics/:id",
      component: "adminTopicEditPage"
    })
    .state({
      name: "auth.adminTopicCreate",
      url: "admin/topics/create",
      component: "adminTopicCreatePage"
    })
    .state({
      name: "auth.adminComponentCreate",
      url: "admin/components/create",
      component: "adminComponentCreatePage"
    })
    .state({
      name: "auth.adminProducts",
      url: "admin/products",
      component: "adminProductsPage"
    })
    .state({
      name: "auth.adminProductEdit",
      url: "admin/products/:id",
      component: "adminProductEditPage"
    })
    .state({
      name: "auth.adminProductCreate",
      url: "admin/products/create",
      component: "adminProductCreatePage"
    })
    .state({
      name: "auth.adminRemotecis",
      url: "admin/remotecis",
      component: "adminRemotecisPage"
    })
    .state({
      name: "auth.adminRemoteciEdit",
      url: "admin/remotecis/:id",
      component: "adminRemoteciEditPage"
    })
    .state({
      name: "auth.adminRemoteciCreate",
      url: "admin/remotecis/create",
      component: "adminRemoteciCreatePage"
    })
    .state({
      name: "auth.globalStatus",
      url: "globalStatus",
      component: "globalStatusPage"
    })
    .state({
      name: "auth.metrics",
      url: "metrics",
      component: "metricsPage"
    });

  $urlRouterProvider.otherwise("/jobs");
};

routes.$inject = ["$stateProvider", "$urlRouterProvider"];

export default routes;

const transition = function($transitions) {
  $transitions.onStart({ to: "auth.**" }, function(transition) {
    const $ngRedux = transition.injector().get("$ngRedux");
    const state = $ngRedux.getState();
    if (!(state.auth.isAuthenticated || localStorage.get().auth.token !== "")) {
      return transition.router.stateService.target("login");
    }
  });
};

transition.$inject = ["$transitions"];

export { transition };
