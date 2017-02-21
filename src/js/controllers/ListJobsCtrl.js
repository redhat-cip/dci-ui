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
  .controller('ListJobsCtrl', ['$state', '$scope', 'api', 'status', 'appCache',
    function ($state, $scope, api, status, appCache) {
      var page = parseInt($state.params.page) || 1;
      var statuses = [];
      var remotes = [];

      $scope.selected = {remotecis: [], status: []};
      $scope.status = _.map(status, function (value, key) {
        value.name = key;
        return value;
      });
      if ($state.params.status) {
        statuses = _.split($state.params.status, ',');
        $scope.selected.status = _.filter($scope.status, function (iter) {
          return _.includes(statuses, iter.name);
        });
      }

      $scope.remotecis = appCache.get('remotecis');
      if (!$scope.remotecis) {
        api.remotecis.list(null, true)
          .then(function (remotecis) {
            $scope.remotecis = remotecis;
            appCache.put('remotecis', $scope.remotecis);
            var remotes = _.split($state.params.remoteci);
            $scope.selected.remotecis = _.filter($scope.remotecis, function (iter) {
              return _.includes(remotes, iter.name);
            });
          });
      } else {
        if ($state.params.remoteci) {
          remotes = _.split($state.params.remoteci, ',');
          $scope.selected.remotecis = _.filter($scope.remotecis, function (iter) {
            return _.includes(remotes, iter.name);
          });
        }
      }

      function pagination(data) {
        $scope.pagination = {
          total: data._meta.count, page: page,
          pageChanged: function () {
            $state.go('jobs', $scope.pagination);
          }
        };
        return data;
      };

      if (statuses.length || remotes.length) {
        api.jobs.search(remotes, statuses)
          .then(function (data) {
            $scope.jobs = data.jobs;
            _.each(data.jobs, function (job) {
              api.jobs.results(job.id).then(function (results) {
                _.each(job.jobdefinition.tests, function (test_jobdef) {
                  _.each(results, function (result) {
                    if (test_jobdef.name == result.filename) {
                      test_jobdef.result = result;
                    }
                    ;
                  });
                });
              });
            });
          });
      } else {
        api.jobs.list(page).then(pagination)
          .then(function (data) {
            $scope.jobs = data.jobs;
            _.each(data.jobs, function (job) {
              api.jobs.results(job.id).then(function (results) {
                _.each(job.jobdefinition.tests, function (test_jobdef) {
                  _.each(results, function (result) {
                    if (test_jobdef.name == result.filename) {
                      test_jobdef.result = result;
                    }
                    ;
                  });
                });
              });
            });
          });
      }

      $scope.retrieveLogs = function () {
        $state.go('logs', {'pattern': $scope.pattern});
      };

      $scope.filters = function () {
        var statuses = _($scope.selected.status).map('name').join(',');
        var remotes = _($scope.selected.remotecis).map('name').join(',');
        $state.go('jobs', {
          'status': statuses,
          'remoteci': remotes,
          'page': page
        });
      };
    }
  ]);



