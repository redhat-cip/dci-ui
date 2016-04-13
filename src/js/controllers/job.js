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
  '$scope', '$injector', 'job', function($scope, $injector, job) {
    var $state = $injector.get('$state');
    var api = $injector.get('api');
    var status = $injector.get('status');
    var moment = $injector.get('moment');
    var helpers = $injector.get('helpers');

    var filePromises = [];
    var opened = false;
    var tabs = ['results', 'files', 'details', 'edit', 'context'];
    var jsonMimes = ['application/json', 'application/junit'];

    function date(d, format) { return moment(d).local().format(format); };

    _.assign($scope, {
      job: job, active: {}, go: $state.go,
      collapses: {remoteci: true, components: true, jobdefinition: true}
    });

    _.each(tabs, function(tab) {
      $scope.active[tab] = $state.is('job.' + tab);
    });

    job.jobdefinition.created_at = date(job.jobdefinition.created_at);
    job.jobdefinition.updated_at = date(job.jobdefinition.updated_at);
    job.remoteci.created_at = date(job.remoteci.created_at);

    _.each(job.jobstates, function(jobstate, i) {
      jobstate.statusClass = 'bs-callout-' + status[jobstate.status].color;
      jobstate.created_at = date(
        jobstate.created_at, 'dddd DD, MMMM h:mm:ss A'
      );

      filePromises.push(api.getFiles(jobstate.id).then(function(files) {
        return jobstate.files = files;
      }));
    });

    helpers.synchronize(filePromises, function(files, i) {
      // cast files.length to boolean
      job.jobstates[i].isOpen = opened = !!files.length;
      return !opened;
    });

    api.getComponents(job.jobdefinition.id).then(function(components) {
      $scope.components = components;
      _.each(components, function(component) {
        component.created_at = date(component.created_at);
      });
    });

    api.getJobFiles(job.id).then(function(files) {
      $scope.files = files;
      $scope.context_files = _.remove(files, function(file) {
        file.collapse = false;
        if (_.indexOf(jsonMimes, file.mime) != -1) {
          file.content = angular.fromJson(file.content);
        }
        return file.mime == 'application/junit';
      });
    });
  }
])

.controller('EditCtrl', [
  '$scope', 'api', 'messages', function($scope, api, messages) {
    var job = $scope.job;

    $scope.reset = function() {
      $scope.form = {
        comment: job.comment,
        status: false
      };
    };
    $scope.reset();

    $scope.isEditableStatus = (
      _.indexOf(['success', 'failure'], job.status) !== -1
    );

    $scope.submit = function() {
      var data = _.transform($scope.form, function(result, value, key) {
        if (_.includes([null, false], value)) { return; }
        if (key == 'status') {
          value = job.status == 'success' ? 'failure' : 'success';
        }
        result[key] = value;
      }, {});
      if (!_.isEmpty(data)) {
        api.updateJob(job.id, job.etag, data).then(
          function(resp) {
            job.processStatus(data.status || job.status);
            job.comment = data.comment || job.comment;
            job.etag = resp.headers('etag');
            messages.alert('job updated', 'success');
            $scope.reset();
          },
          function(error) {
            var str = [
              error.status, error.statusText + '-', error.data.message
            ];
            messages.alert(str.join(' '), 'danger');
          }
        );
      }
    };
  }
])
.controller('fileJunitStatusController', ['$scope', function($scope) {
    $scope.bucket = $scope.file.content.testscases;
    $scope.input = {
      passed: false, skipped: false, failure: false, error: false
    };

    console.log($scope.bucket);
    $scope.filterjunit = function() {
      if (!_.some(_.values($scope.input))) {
        $scope.bucket = $scope.file.content.testscases;
      } else {
        $scope.bucket = _.filter(
          $scope.file.content.testscases, function(testcase) {
            return $scope.input[testcase.result.action];
          }
        );
      }
    };
  }
]);
