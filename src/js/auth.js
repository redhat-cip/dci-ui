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

require("app")
  .constant("userStatus", {
    DISCONNECTED: 0,
    UNAUTHORIZED: 1,
    AUTHENTICATED: 2
  })
  .value("user", {})
  .factory("auth", [
    "$window",
    "$cookieStore",
    "api",
    "user",
    "userStatus",
    function($window, $cookies, api, user, userStatus) {
      angular.extend(
        user,
        { status: userStatus.DISCONNECTED },
        $cookies.get("user")
      );

      return {
        user: user,
        login: function(username, password) {
          user.token = $window.btoa(username.concat(":", password));

          return api.users
            .getByName(username)
            .then(function(userRes) {
              angular.extend(user, userRes, {
                status: userStatus.AUTHENTICATED
              });
              $cookies.put("user", user);
              return user;
            })
            .catch(function(err) {
              console.log(err);
            });
        },
        isAuthenticated: function() {
          return user.status === userStatus.AUTHENTICATED;
        },
        isAdmin: function() {
          return user.role.label === "ADMIN";
        },
        isSuperAdmin: function() {
          return user.role.label === "SUPER_ADMIN";
        },
        logout: function() {
          $cookies.remove("user");
          user.status = userStatus.DISCONNECTED;
        }
      };
    }
  ])
  .controller("authCtrl", [
    "$scope",
    "$state",
    "auth",
    function($scope, $state, auth) {
      $scope.isAdmin = auth.isAdmin;
      $scope.isSuperAdmin = auth.isSuperAdmin;
      $scope.user = auth.user;

      $scope.isUserPage = function() {
        return $state.includes("adminUsers") || $state.includes("adminUser");
      };

      $scope.isTeamPage = function() {
        return $state.includes("adminTeams") || $state.includes("adminTeam");
      };

      $scope.isTopicPage = function() {
        return $state.includes("adminTopics") || $state.includes("adminTopic");
      };

      $scope.isRemoteCIPage = function() {
        return (
          $state.includes("adminRemotecis") || $state.includes("adminRemoteci")
        );
      };

      $scope.isAdminPage = function() {
        return (
          $scope.isUserPage() ||
          $scope.isTeamPage() ||
          $scope.isTopicPage() ||
          $scope.isRemoteCIPage() ||
          $state.includes("adminAudits")
        );
      };

      $scope.isJobsPage = function() {
        return $state.includes("jobs") || $scope.isJobPage();
      };

      $scope.isJobPage = function() {
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

      $scope.logout = function() {
        auth.logout();
        $state.go("login");
      };
    }
  ])
  .factory("basicAuthInterceptor", [
    "user",
    function(user) {
      return {
        request: function(config) {
          config.headers["Authorization"] = "Basic " + user.token;
          return config;
        }
      };
    }
  ])
  .config([
    "$httpProvider",
    function($httpProvider) {
      $httpProvider.interceptors.push("basicAuthInterceptor");
    }
  ]);
