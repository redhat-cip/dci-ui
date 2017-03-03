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
        //$scope.metas = metas;
      };
      $scope.reset();

      $scope.submit = function() {
        // process and clean data
        var data = _.transform($scope.form, function(result, value, key) {
          if (_.includes([null, false], value)) {
            return;
          }
          result[key] = value;
        }, _.pick(job, ['id', 'etag']));

        // api call for updating job
        api.jobs.update(data).then(
          function(resp) {
            job.processStatus(data.status || job.status);
            job.comment = data.comment || job.comment;
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

      $scope.metasadd = function() {
        // process and clean data
        var data = _.pick($scope.form, ['name', 'value']);

        // api call for updating job
        api.jobs.metas.post(job, data).then(
          function() {
            // job.processStatus(data.name);
            $scope.metas = _.concat($scope.metas, data);
            msg.alert('Meta Data added', 'success');
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
      $scope.metasremove = function(obj) {
        // process and clean data

        // api call for updating job
        api.jobs.metas.delete($scope.job.id, $scope.metas[obj].id).then(
          function() {
            _.pullAt($scope.metas, obj);

            msg.alert('Meta Data deleted', 'success');
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
  ]);
