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
    api.topics.list(null, true).then(_.partial(_.set, $scope, 'topics'));;
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
  'api', '$scope', 'topic', 'componentType',
  function(api, $scope, topic, componentType) {
    $scope.componentType = componentType;
    $scope.topic = topic;
    // Reducting components to the right type.
    api.topics.components(topic).then(function(components) {
      $scope.components = _.filter(components, ['type', componentType]);
      // TODO(cedric)
      // When we have job template we can delete the reduce
      api.jobdefinitions.list(null, true).then(function(jobdefs) {
        $scope.jobdefs = _.reduce(jobdefs, function(result, jobdefs) {
          if (jobdefs.topic_id == topic && !_.includes(result, jobdef.name))
            return _.concat(result, jobdefs.name);
          }
          return result;
        }, []);
        api.jobs.list(null, true).then(function(jobstatus) {
          $scope.jobstatus = _.reduce(jobstatus, function(result, obj) {
            var component;
            component = obj.jobdefinition.jobdefinition_component.component_id;
            var def_name = obj.jobdefinition.name;
            if (obj.jobdefinition.topic_id == topic) {
              (result[def_name] || (result[def_name] = [])).push(component);
              result[def_name + '_status'] = obj.status;
            }
            return result;
          }, {});
          var gstatus = [];
          var jstatus;
          _.each($scope.jobdefs, function(jobdef) {
            _.each($scope.components, function(puddle) {
              if (!_.isObject(gstatus[jobdef])) {
                gstatus[jobdef] = {};
              }
              if (!_.isObject(gstatus[jobdef][puddle])) {
                gstatus[jobdef][puddle.name] = {};
              }
              if (_.indexOf($scope.jobstatus[jobdef], puddle.id) >= 0) {
                jstatus = $scope.jobstatus[jobdef + '_status'];
                gstatus[jobdef][puddle.name] = jstatus;
              }
              if (_.isEmpty(gstatus[jobdef][puddle.name])) {
                gstatus[jobdef][puddle.name] = 'N/A';
              }
            });
          });
          $scope.gstatus = gstatus;
        });
      });
    });
  }
]);
