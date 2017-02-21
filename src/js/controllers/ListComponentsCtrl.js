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
  .controller('ListComponentsCtrl', [
    '$injector', '$scope', 'topic', function ($injector, $scope, topic) {
      var api = $injector.get('api');
      var moment = $injector.get('moment');
      var msg = $injector.get('messages');

      _.assign($scope, {objForm: {}});

      $scope.topic = topic;
      $scope.create = function (componentId) {
        if ($scope.objForm.$invalid) {
          return;
        }
        api.components.create(JSON.stringify(this.c))
          .then(
            function (res) {
              msg.alert('Create component successfully', 'success');
            },
            function (err) {
              msg.alert(err.data.message, 'danger');
            });
      };

      $scope.update = function (component) {
        if ($scope.objForm.$invalid) {
          return;
        }
        api.components.update(this.c)
          .then(
            function (res) {
              msg.alert('Component successfully updated', 'success');
            },
            function (err) {
              msg.alert(err.data.message, 'danger');
            });
      };

      api.topics.components(topic.id)
        .then(function (data) {
          $scope.componentsByTopic = {};
          _.each(data, function (component) {
            _.update($scope.componentsByTopic, component.type, function (target) {
              component.created_at_formatted = moment(component.created_at)
                .local()
                .format();
              component.updated_at_formatted = moment(component.updated_at)
                .local()
                .format();
              component.data = JSON.stringify(component.data);
              return _.concat(target || [], component);
            });
          });
        });
    }
  ]);



