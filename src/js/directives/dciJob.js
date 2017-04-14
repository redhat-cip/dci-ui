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
  .directive('dciJob', [
    '$state', '$uibModal', 'api', 'status', 'messages',
    function($state, $uibModal, api, status, messages) {
      return {
        link: function(scope) {
          var job = scope.job;

          job.processStatus = function(s) {
            job.status = s;
            job.statusClass = 'bs-callout-' + status[s].color;
            job.glyphicon = status[s].glyphicon;
          };

          job.processStatus(job.status);

          scope.recheck = function() {
            api.jobs.recheck(job.id).then(function(job) {
              $state.go('job.results', {id: job.id});
            });
          };

          scope.deleteJob = function() {
            var deleteJobModal = $uibModal.open({
              component: 'confirmDestructiveAction',
              resolve: {
                data: function() {
                  return {
                    title: 'Delete job',
                    body: 'Are you you want to delete this job?',
                    okButton: 'Yes delete it',
                    cancelButton: 'oups no!'
                  }
                }
              }
            });
            deleteJobModal.result.then(function() {
              api.jobs.remove(job.id, job.etag)
                .then(function() {
                  messages.alert('Job "' + job.id + '" deleted !', 'success');
                  $state.go('index');
                })
                .catch(function(err) {
                  messages.alert('Cannot delete this job, retry in few minutes (' + err.data.message + ')', 'danger');
                });
            });
          };
        },
        templateUrl: '/partials/directives/dci-job.html'
      };
    }]);
