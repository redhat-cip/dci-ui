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

import * as authActions from "services/auth/actions";

class MenuCtrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  logout() {
    this.$ngRedux.dispatch(authActions.logout());
  }

  isUserPage() {
    return (
      this.router.currentState.name === "auth.adminUsers" ||
      this.router.currentState.name === "auth.adminUserCreate" ||
      this.router.currentState.name === "auth.adminUserEdit"
    );
  }

  isTeamPage() {
    return (
      this.router.currentState.name === "auth.adminTeams" ||
      this.router.currentState.name === "auth.adminTeamCreate" ||
      this.router.currentState.name === "auth.adminTeamEdit"
    );
  }

  isTopicPage() {
    return (
      this.router.currentState.name === "auth.adminTopics" ||
      this.router.currentState.name === "auth.adminTopicCreate" ||
      this.router.currentState.name === "auth.adminTopicEdit"
    );
  }

  isRemoteCIPage() {
    return (
      this.router.currentState.name === "auth.adminRemotecis" ||
      this.router.currentState.name === "auth.adminRemoteciCreate" ||
      this.router.currentState.name === "auth.adminRemoteciEdit"
    );
  }

  isProductPage() {
    return (
      this.router.currentState.name === "auth.adminProducts" ||
      this.router.currentState.name === "auth.adminProductCreate" ||
      this.router.currentState.name === "auth.adminProductEdit"
    );
  }

  isAdminPage() {
    return (
      this.isUserPage() ||
      this.isTeamPage() ||
      this.isTopicPage() ||
      this.isRemoteCIPage() ||
      this.isProductPage()
    );
  }

  isPasswordPage() {
    return this.router.currentState.name === "auth.password";
  }

  isSettingsPage() {
    return this.router.currentState.name === "auth.settings";
  }

  isNotificationPage() {
    return this.router.currentState.name === "auth.notification";
  }

  isSettingsOrPasswordPage() {
    return (
      this.isSettingsPage() ||
      this.isPasswordPage() ||
      this.isNotificationPage()
    );
  }

  shouldDisplaySubMenu() {
    return (
      this.isAdminPage() || this.isJobPage() || this.isSettingsOrPasswordPage()
    );
  }

  isJobsPage() {
    return this.router.currentState.name === "auth.jobs";
  }

  isJobPage() {
    return (
      this.router.currentState.name === "auth.job.jobStates" ||
      this.router.currentState.name === "auth.job.tests" ||
      this.router.currentState.name === "auth.job.issues" ||
      this.router.currentState.name === "auth.job.files"
    );
  }
}

MenuCtrl.$inject = ["$scope", "$ngRedux"];

export default MenuCtrl;
