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
    '$scope', '$stateParams', 'api', function($scope, $stateParams, api) {
      $scope.componentTypes = [];
      $scope.topic = $stateParams.id;

      $scope.q = api.topics.components($scope.topic).then(function(components) {
        $scope.components = components;
        // Create a uniq list of component type
        _.each(components, function(component) {
          var type = {'name': component.type};
          if (_.findIndex($scope.componentTypes, type) === -1) {
            $scope.componentTypes.push(type);
          }
        });
      });
    }
  ]);



