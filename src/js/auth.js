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
  .value("user", {})
  .config([
    "$httpProvider",
    function($httpProvider) {
      $httpProvider.interceptors.push("basicAuthHTTPInterceptor");
      $httpProvider.interceptors.push("unauthorizedHTTPInterceptor");
    }
  ])
  .factory("basicAuthHTTPInterceptor", [
    "user",
    function(user) {
      return {
        request: function(config) {
          var apiURL = new RegExp("api/");
          if (!config.url.match(apiURL)) {
            return config;
          }

          config.headers["Authorization"] = "Basic " + user.token;
          return config;
        }
      };
    }
  ])
  .factory("unauthorizedHTTPInterceptor", [
    "$q",
    "user",
    function($q, user) {
      return {
        responseError: function(response) {
          if (response.status === 401) {
            user.isAuthenticated = false;
          }
          return $q.reject(response);
        }
      };
    }
  ])
  .factory("auth", [
    "$window",
    "$cookieStore",
    "api",
    "user",
    function($window, $cookies, api, user) {
      angular.extend(user, { isAuthenticated: false }, $cookies.get("user"));

      return {
        user: user,
        login: function(username, password) {
          user.token = $window.btoa(username.concat(":", password));

          return api.users.getByName(username).then(function(userRes) {
            angular.extend(user, userRes, { isAuthenticated: true });
            $cookies.put("user", user);
            return user;
          });
        },

        isAuthenticated: function() {
          return user.isAuthenticated;
        },

        isAdmin: function() {
          return user.isAuthenticated && user.role.label === "ADMIN";
        },

        isSuperAdmin: function() {
          return user.isAuthenticated && user.role.label === "SUPER_ADMIN";
        },

        logout: function() {
          $cookies.remove("user");
          user.isAuthenticated = false;
        }
      };
    }
  ]);
