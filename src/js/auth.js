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
  .config([
    "$httpProvider",
    function($httpProvider) {
      // Set header to help detect XHR request
      $httpProvider.defaults.headers.common["X-Requested-With"] =
        "XMLHttpRequest";

      var interceptor = [
        "$q",
        "user",
        "userStatus",
        function($q, user, status) {
          var apiURL = new RegExp("api/");

          return {
            request: function(conf) {
              if (!conf.url.match(apiURL)) {
                return conf;
              }
              if (!user.token) {
                return angular.extend(conf, { status: 401 });
              }

              conf.headers.Authorization = "Basic " + user.token;
              return conf;
            },
            responseError: function(error) {
              if (user.status !== status.DISCONNECTED && error.status === 401) {
                user.status = status.UNAUTHORIZED;
              }
              return $q.reject(error);
            }
          };
        }
      ];
      $httpProvider.interceptors.push(interceptor);
    }
  ])
  .factory("auth", [
    "$window",
    "$cookieStore",
    "api",
    "user",
    "userStatus",
    function($window, $cookies, api, user, status) {
      angular.extend(
        user,
        { status: status.DISCONNECTED },
        $cookies.get("user")
      );

      return {
        user: user,
        login: function(username, password) {
          user.token = $window.btoa(username.concat(":", password));

          return api.users.getByName(username).then(function(userRes) {
            angular.extend(user, userRes, { status: status.AUTHENTICATED });
            $cookies.put("user", user);
            return user;
          });
        },
        isAuthenticated: function() {
          return user.status === status.AUTHENTICATED;
        },

        isAdmin: function() {
          return user.role.label === "ADMIN";
        },

        isSuperAdmin: function() {
          return user.role.label === "SUPER_ADMIN";
        },

        logout: function() {
          $cookies.put("user", {});
          user.status = status.DISCONNECTED;
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
        return (
          $state.includes("adminUsers") ||
          $state.includes("adminUserCreate") ||
          $state.includes("adminUserEdit")
        );
      };

      $scope.isTeamPage = function() {
        return (
          $state.includes("adminTeams") ||
          $state.includes("adminTeamCreate") ||
          $state.includes("adminTeamEdit")
        );
      };

      $scope.isTopicPage = function() {
        return (
          $state.includes("adminTopics") ||
          $state.includes("adminTopicCreate") ||
          $state.includes("adminTopicEdit")
        );
      };

      $scope.isRemoteCIPage = function() {
        return (
          $state.includes("adminRemotecis") ||
          $state.includes("adminRemoteciCreate") ||
          $state.includes("adminRemoteciEdit")
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
  .run(["auth", angular.noop]);
