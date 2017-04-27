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

require("app").controller("ListJobsCtrl", [
  "$state",
  "$scope",
  "api",
  "status",
  function($state, $scope, api, status) {
    var page = parseInt($state.params.page) || 1;
    var statuses = [];

    $scope.selected = { status: [] };
    $scope.status = _.map(status, function(value, key) {
      value.name = key;
      return value;
    });
    if ($state.params.status) {
      statuses = _.split($state.params.status, ",");
      $scope.selected.status = _.filter($scope.status, function(s) {
        return _.includes(statuses, s.name);
      });
    }

    function pagination(data) {
      $scope.pagination = {
        total: data._meta.count,
        page: page,
        pageChanged: function() {
          $state.go("jobs", $scope.pagination);
        }
      };
      return data;
    }

    api.jobs.list(page, statuses).then(pagination).then(function(data) {
      $scope.jobs = data.jobs;
    });

    $scope.filters = function() {
      var statuses = _($scope.selected.status).map("name").join(",");
      $state.go("jobs", {
        status: statuses,
        page: page
      });
    };

    $scope.clearFilters = function() {
      $state.go("jobs", {
        status: [],
        page: page
      });
    };

    $scope.reloadPage = function() {
      $state.reload();
    };
  }
]);
