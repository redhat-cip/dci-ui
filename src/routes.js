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

import { getToken } from "services/localStorage";

const routes = function($stateProvider, $urlRouterProvider, $locationProvider) {
  const defaultRoute = "/jobs";
  $stateProvider
    .state({
      name: "auth",
      url: "/",
      template: `
<div class="pf-grid">
    <div class="pf-header">
      <dci-masthead></dci-masthead>
    </div>
    <div class="pf-sidebar">
      <dci-menu></dci-menu>
    </div>
    <div class="pf-content">
      <ui-view class="pf-main-content"></ui-view>
    </div>
</div>`,
      abstract: true
    })
    .state({
      name: "login",
      url: "/login?next",
      component: "loginPage",
      params: {
        next: defaultRoute
      }
    })
    .state({
      name: "auth.jobs",
      url: "jobs?remoteci_id",
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
      name: "auth.job.issues",
      url: "issues",
      component: "jobIssuesPage"
    })
    .state({
      name: "auth.job.files",
      url: "files",
      component: "jobFilesPage"
    })
    .state({
      name: "auth.job.certification",
      url: "certification",
      component: "jobCertificationPage"
    })
    .state({
      name: "auth.components",
      url: "components",
      component: "componentsPage"
    })
    .state({
      name: "auth.topics",
      url: "topics",
      component: "topicsScreen"
    })
    .state({
      name: "auth.topicCreate",
      url: "topics/create",
      component: "topicCreatePage"
    })
    .state({
      name: "auth.topicEdit",
      url: "topics/edit/:id",
      component: "topicEditPage"
    })
    .state({
      name: "auth.topicDetails",
      url: "topics/details/:id",
      component: "topicDetailsPage"
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
      name: "auth.products",
      url: "products",
      component: "productsScreen"
    })
    .state({
      name: "auth.productEdit",
      url: "products/:id",
      component: "productEditPage"
    })
    .state({
      name: "auth.productCreate",
      url: "products/create",
      component: "productCreatePage"
    })
    .state({
      name: "auth.remotecis",
      url: "remotecis",
      component: "remotecisScreen"
    })
    .state({
      name: "auth.remoteciEdit",
      url: "remotecis/:id",
      component: "remoteciEditPage"
    })
    .state({
      name: "auth.remoteciCreate",
      url: "remotecis/create",
      component: "remoteciCreatePage"
    })
    .state({
      name: "auth.feeders",
      url: "feeders",
      component: "feedersScreen"
    })
    .state({
      name: "auth.feederEdit",
      url: "feeders/:id",
      component: "feederEditPage"
    })
    .state({
      name: "auth.feederCreate",
      url: "feeders/create",
      component: "feederCreatePage"
    })
    .state({
      name: "auth.globalStatus",
      url: "globalStatus?tab",
      component: "globalStatusPage",
      reloadOnSearch: false
    });
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise(defaultRoute);
};

routes.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

export default routes;

const transition = function($transitions, $state) {
  $transitions.onStart({ to: "auth.**" }, transition => {
    const token = getToken();
    if (!token) {
      const next = $state.href(transition.to().name, transition.params());
      return transition.router.stateService.target("login", { next });
    }
  });
};

transition.$inject = ["$transitions", "$state"];

export { transition };
