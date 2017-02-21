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

'use strict';

require('app')
.controller('LogsCtrl', [
  '$state', '$scope', '$q', 'api', 'status',
  function($state, $scope, $q, api, status) {
    $scope.pattern = $state.params.pattern;

    $scope.retrieveLogs = function() {
      $state.go('logs', {'pattern': $scope.pattern});
    };

    $scope.status = function(log) {
      if (!log.job) {
        return 'panel-default';
      }
      return 'panel-' + status[log.job.status].color;
    };

    if (!$scope.pattern) {
      return;
    }

    $scope.search = api.search.create($state.params.pattern)
      .then(function(res) {
        $scope.logs = res.logs.hits;

        return $q.all(_.map($scope.logs, function(log) {
          log = log._source;
          if (log.job_id) {
            return api.jobs.get(log.job_id, true);
          } else {
            return api.jobstates.get(log.jobstate_id).then(_.property('job'));
          }
        }));
      })
      .then(function(res) {
        _.each(_.zip($scope.logs, res), _.spread(function(log, job) {
          log.job = job;
        }));
      });
  }
]);
