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
  .controller('GpanelIndexCtrl', [
    '$scope', 'api', function($scope, api) {

      api.topics.list(null, true).then(function(topics) {
        $scope.topics = topics;
        _.each(topics, function(topic) {
          api.topics.jobdefinitions(topic.id).then(function(jobDefinition) {
            topic.jobdefinition_type = encodeURI(jobDefinition[0]['component_types'][0]) || 'puddle_osp';
            api.topics.status(topic).then(function(jobs) {
              topic.jobs = jobs;
              _.each(jobs, function(job) {
                if (['new', 'pre-run', 'post-run']
                    .indexOf(job.job_status) !== -1) {
                  job.state = 'text-info';
                } else if (['failure', 'product-failure', 'deployment-failure']
                    .indexOf(job.job_status) !== -1) {
                  job.state = 'text-danger';
                } else if (job.job_status == 'success') {
                  job.state = 'text-success';
                } else if (job.job_status == 'killed') {
                  job.state = 'text-warning';
                }
              });
            });
          });
        });
      });
    }
  ]);



