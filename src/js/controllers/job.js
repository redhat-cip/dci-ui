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
    var $sce = $injector.get('$sce');
    var $state = $injector.get('$state');
    var api = $injector.get('api');
    var config = $injector.get('config');
    var status = $injector.get('status');
    var moment = $injector.get('moment');
    var utils = $injector.get('utils');
    var _ = $injector.get('_');

    var filePromises = [];
    var opened = false;

    _.assign($scope, {
      job: job, active: {}, go: $state.go,
      collapses: {
        test: true, remoteci: true, components: true, jobdefinition: true
      }
    });

    _.each(['index', 'details', 'edit', 'context', 'metrics'], function(tab) {
      $scope.active[tab] = $state.is('job.' + tab);
    });

    job.dashboard_url = $sce.trustAsResourceUrl(config.grafanaURL + '/dashboard-solo/db/testing-dci-table' + job.id.replace(/-/g, '') + '?panelId=1&fullscreen&theme=light');
    job.dashboard_url_2 = $sce.trustAsResourceUrl(config.grafanaURL + '/dashboard-solo/db/testing-dci-table' + job.id.replace(/-/g, '') + '?panelId=2&fullscreen&theme=light');
    job.dashboard_url_3 = $sce.trustAsResourceUrl(config.grafanaURL + '/dashboard-solo/db/testing-dci-table' + job.id.replace(/-/g, '') + '?panelId=4&fullscreen&theme=light');
    job.dashboard_url_4 = $sce.trustAsResourceUrl(config.grafanaURL + '/dashboard-solo/db/testing-dci-table' + job.id.replace(/-/g, '') + '?panelId=5&fullscreen&theme=light');

    job.jobdefinition.created_at = (
      moment(job.jobdefinition.created_at).local().format()
    );
    job.jobdefinition.updated_at = (
      moment(job.jobdefinition.updated_at).local().format()
    );
    job.jobdefinition.test.created_at = (
      moment(job.jobdefinition.test.created_at).local().format()
    );
    job.remoteci.created_at = moment(job.remoteci.created_at).local().format();

    _.each(job.jobstates, function(jobstate, i) {
      jobstate.statusClass = 'bs-callout-' + status[jobstate.status].color;
      jobstate.created_at = (
        moment(jobstate.created_at).local().format('dddd DD, MMMM h:mm:ss A')
      );

      filePromises.push(api.getFiles(jobstate.id).then(function(files) {
        return jobstate.files = files;
      }));
    });

    utils.synchronize(filePromises, function(files, i) {
      // cast files.length to boolean
      job.jobstates[i].isOpen = opened = !!files.length;
      return !opened;
    });

    api.getComponents(job.jobdefinition.id).then(function(components) {
      $scope.components = components;
      _.each(components, function(component) {
        component.created_at = moment(component.created_at).local().format();
      });
    });

    api.getJobFiles(job.id).then(function(files) {
      $scope.files = files;
      _.each(files, function(file) {
        file.collapse = false;
        if (file.mime == 'application/json') {
          file.content = angular.fromJson(file.content);
        }
      });
    });
  }
])

.controller('EditCtrl', [
  '$scope', '_', 'api', 'messages', function($scope, _, api, messages) {
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
]);

