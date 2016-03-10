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
.controller('TopicCtrl', [
  '$scope', '$injector', 'topic', function($scope, $injector, topic) {
    var $state = $injector.get('$state');
    var api = $injector.get('api');
    var _ = $injector.get('_');

    _.assign($scope, {
      topic: topic, active: {}, go: $state.go,
      topicForm: {},
    });

    _.each(['edit'], function(tab) {
      $scope.active[tab] = $state.is('topic.' + tab);
    });

    var update = function(entity, method, form, value) {

      return function() {
        if (form.$invalid) { return; }
        $state.go('administrate.topics');
        method(value).then(
          function(res) {
            msg.alert('Topic has been updated', 'success');
          },
          function(err) {
            if (err.status === 422) {
              msg.alert('Topic has failed updating', 'danger');
            } else {
              msg.alert(err.data.message, 'danger');
            }
          }
        );
      };
    };

    $scope.cancelTopic = function() { $state.go('administrate.topics'); };

    $scope.updateTopic = update(
      'topic', api.putTopic, $scope.topicForm, $scope.topic
    );
  }
]);
