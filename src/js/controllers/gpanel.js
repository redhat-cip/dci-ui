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
.controller('GpanelTopicCtrl', [
  '$scope', 'api', function($scope, api) {
    api.topics.list(null, true).then(_.partial(_.set, $scope, 'topics'));
  }
])
.controller('GpanelCompoCtrl', [
  '$scope', 'api', 'topic', function($scope, api, topic) {
    $scope.componentTypes = [];
    api.topics.components(topic).then(function(components) {
      $scope.components = components;
      // Create a uniq list of component type
      _.each(components, function(component) {
        if (_.isUndefined(_.find($scope.componentTypes,
                                 {'name': component.type}))) {
          $scope.componentTypes = _.concat($scope.componentTypes,
                                           {'name': component.type});
        }
      });
    });
    $scope.topic = topic;
  }
])
.controller('GpanelStatusCtrl', [
  '$injector', '$scope', 'topic', 'componentType',
  function($injector, $scope, topic, componentType) {
    var api = $injector.get('api');
    var moment = $injector.get('moment');
    $scope.status = $injector.get('status');

    $scope.componentType = componentType;
    api.topics.get(topic).then(_.partial(_.set, $scope, 'topic'));
    api.topics.jobdefinitions(topic)
      .then(_.partial(_.set, $scope, 'jobdefs'));

    // Build a list of available components
    api.topics.components(topic).then(function(components) {
      $scope.components = _.filter(components, ['type', componentType]);

      _.each($scope.components, function(component) {
        api.topics.components.jobs(topic, component.id).then(function(jobs) {
          _.each(jobs, function(job) {
            _.update($scope, ['jobs', component.id, job.jobdefinition_id],
                     function(target) {
                       target = target || {};
                       target[job.status] = target[job.status] + 1 || 1;
                       return target;
                     });
          });
        });
      });
    });
  }
]);
