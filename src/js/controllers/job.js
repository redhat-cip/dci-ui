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

    var opened = false;
    var tabs = ['results', 'logs', 'details', 'edit', 'context',
                'stackdetails', 'issues', 'files'];

    function date(d, format) { return moment(d).local().format(format); };

    _.assign($scope, {
      job: job, active: {}, go: $state.go,
      collapses: {remoteci: false, jobdefinition: false}
    });

    _.each(tabs, function(tab) {
      $scope.active[tab] = $state.is('job.' + tab);
    });

    job.jobdefinition.created_at = date(job.jobdefinition.created_at);
    job.jobdefinition.updated_at = date(job.jobdefinition.updated_at);
    job.remoteci.created_at = date(job.remoteci.created_at);
    job.configuration = angular.fromJson(job.configuration);

    _.each(job.jobstates, function(jobstate, i) {
      jobstate.statusClass = 'bs-callout-' + status[jobstate.status].color;
      jobstate.created_at = date(
        jobstate.created_at, 'dddd DD, MMMM h:mm:ss A'
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
            if (!file.content.testscases) { return; }
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
])
.controller('IssueCtrl', ['$scope', 'api', function($scope, api) {
  $scope.submit = function() {
    api.issues.create($scope.job.id, $scope.issue).then(function(issues) {
      $scope.job.issues.push(_.last(issues));
      $scope.issue = null;
    });
  };

  $scope.remove = function(job, issue) {
    return api.issues.remove(job.id, issue.id, issue.etag)
      .then(function() {
        _.pullAt(job.issues, _.findIndex(job.issues, ['id', issue.id]));
      });
  };
}])
.filter('titlecase', function() {
  return function(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
})
.filter('point', function() {
  return function(input) {
    return input + (input.charAt(input.length - 1) === '.' ? '' : '.');
  };
})
.controller('EditCtrl', [
  '$scope', 'api', 'messages', function($scope, api, msg) {
    var job = $scope.job;

    $scope.reset = function() {
      $scope.status = ['failure', 'success', 'killed', 'product-failure',
                       'deployment-failure'];
      $scope.form = {
        comment: job.comment,
        status: job.status
      };
    };
    $scope.reset();

    $scope.submit = function() {
      // process and clean data
      var data = _.transform($scope.form, function(result, value, key) {
        if (_.includes([null, false], value)) { return; }
        result[key] = value;
      }, _.pick(job, ['id', 'etag']));

      // api call for updating job
      api.jobs.update(data).then(
        function(resp) {
          job.processStatus(data.status || job.status);
          job.comment = data.comment || job.comment;
          job.etag = resp.headers('etag');
          msg.alert('job updated', 'success');
          $scope.reset();
        },
        function(error) {
          if (error === 'empty') {
            return msg.alert('No data provided for update', 'danger');
          }
          var str = [
            error.status, error.statusText + '-', error.data.message
          ];
          msg.alert(str.join(' '), 'danger');
        }
      );
    };
  }
])
.controller('fileJunitStatusController', ['$scope', function($scope) {
    $scope.bucket = $scope.file.content.testscases;
    $scope.input = {
      passed: false, skipped: false, failure: false, error: false
    };

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
