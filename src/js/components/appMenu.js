// Copyright 2015 Red Hat, Inc.
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

"use strict";

require("app").component("appMenu", {
  templateUrl: "/partials/components/menu.html",
  controller: ["$state", "auth", "user", AppMenuCtrl]
});

function AppMenuCtrl($state, auth, user) {
  var $ctrl = this;

  $ctrl.isAdmin = auth.isAdmin;
  $ctrl.isSuperAdmin = auth.isSuperAdmin;
  $ctrl.auth = auth;
  $ctrl.user = user;

  $ctrl.isUserPage = function() {
    return (
      $state.includes("adminUsers") ||
      $state.includes("adminUserCreate") ||
      $state.includes("adminUserEdit")
    );
  };

  $ctrl.isTeamPage = function() {
    return (
      $state.includes("adminTeams") ||
      $state.includes("adminTeamCreate") ||
      $state.includes("adminTeamEdit")
    );
  };

  $ctrl.isTopicPage = function() {
    return (
      $state.includes("adminTopics") ||
      $state.includes("adminTopicCreate") ||
      $state.includes("adminTopicEdit")
    );
  };

  $ctrl.isRemoteCIPage = function() {
    return (
      $state.includes("adminRemotecis") ||
      $state.includes("adminRemoteciCreate") ||
      $state.includes("adminRemoteciEdit")
    );
  };

  $ctrl.isAdminPage = function() {
    return (
      $ctrl.isUserPage() ||
      $ctrl.isTeamPage() ||
      $ctrl.isTopicPage() ||
      $ctrl.isRemoteCIPage() ||
      $state.includes("adminAudits")
    );
  };

  $ctrl.isPasswordPage = function() {
    return $state.includes("password");
  };

  $ctrl.isSettingsPage = function() {
    return $state.includes("settings");
  };

  $ctrl.isSettingsOrPasswordPage = function() {
    return $ctrl.isSettingsPage() || $ctrl.isPasswordPage();
  };

  $ctrl.shouldDisplaySubMenu = function() {
    return (
      $ctrl.isAdminPage() ||
      $ctrl.isJobPage() ||
      $ctrl.isSettingsOrPasswordPage()
    );
  };

  $ctrl.isJobsPage = function() {
    return $state.includes("jobs");
  };

  $ctrl.isJobPage = function() {
    return (
      $state.includes("job.results") ||
      $state.includes("job.logs") ||
      $state.includes("job.details") ||
      $state.includes("job.edit") ||
      $state.includes("job.stackdetails") ||
      $state.includes("job.issues") ||
      $state.includes("job.files")
    );
  };

  $ctrl.logout = function() {
    auth.logout();
    $state.go("login");
  };
}
