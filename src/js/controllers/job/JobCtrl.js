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
  .controller('JobCtrl', [
    '$scope', '$state', 'job', 'api', 'status', 'moment',
    function($scope, $state, job, api, status, moment) {
      var tabs = ['results', 'logs', 'details', 'edit', 'context',
        'stackdetails', 'issues', 'files'];

      function date(d, format) {
        return moment(d).local().format(format);
      }

      _.assign($scope, {
        job: job, active: {}, go: $state.go,
        collapses: {remoteci: false, jobdefinition: false}
      });

      _.each(tabs, function(tab) {
        $scope.active[tab] = $state.is('job.' + tab);
      });

      job.jobdefinition.created_at_formatted = date(job.jobdefinition.created_at);
      job.jobdefinition.updated_at_formatted = date(job.jobdefinition.updated_at);
      job.remoteci.created_at_formatted = date(job.remoteci.created_at);
      job.remoteci.updated_at_formatted = date(job.remoteci.updated_at);
      job.configuration = angular.fromJson(job.configuration);

      _.each(job.jobstates, function(jobstate) {
        jobstate.statusClass = 'bs-callout-' + status[jobstate.status].color;
        jobstate.created_at_formatted = date(
          jobstate.created_at, 'dddd DD, MMMM h:mm:ss A'
        );
        jobstate.updated_at_formatted = date(
          jobstate.updated_at, 'dddd DD, MMMM h:mm:ss A'
        );
      });

      $scope.retrieveFiles = function(jobstate) {
        jobstate.isOpen = !jobstate.isOpen;
        _.each(jobstate.files, function(file) {
          api.files.content(file.id).then(function(res) {
            file.content = res.data;
          });
        });
      };

      api.jobs.metas(job.id).then(function(metas) {
        $scope.metas = metas;
      });

      api.jobdefinitions.tests(job.jobdefinition.id).then(function(tests) {
        $scope.jtests = tests;
      });

      api.remotecis.tests(job.remoteci.id).then(function(tests) {
        $scope.rtests = tests;
      });

      api.jobs.files(job.id).then(function(files) {
        $scope.files = files;

        $scope.text_files = _.remove(files, function(file) {
          if (file.mime == 'text/plain') {
            api.files.content(file.id).then(function(res) {
              file.content = res.data;
            });
          }
          return file.mime == 'text/plain';
        });

        $scope.junit_files = _.remove(files, function(file) {
          file.collapse = false;
          if (file.mime == 'application/junit') {
            api.files.content(file.id).then(function(res) {
              file.content = res.data;
              if (!file.content.testscases) {
                return;
              }
              file.content.skips = _.reduce(
                file.content.testscases, function(sum, testcase) {
                  return sum + (testcase.result.action == 'skipped' ? 1 : 0);
                }, 0
              );
            });
          }
          return file.mime == 'application/junit';
        });
      });
    }
  ]);
