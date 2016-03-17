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
.controller('AdminCtrl', [
  '$scope', '$injector', 'data', function($scope, $injector, data) {

    var $state = $injector.get('$state');
    var msg = $injector.get('messages');
    var user = $injector.get('user');
    var api = $injector.get('api');
    var _ = $injector.get('_');

    var rm = function(entity, collection, method) {
      var tplt = _.template('<%= key %> "<%= value %>" has been removed');
      return function(value, index) {
        method(value.id, value.etag).then(function() {
          collection.splice(index, 1);
          msg.alert(tplt({key: entity, value: value.name}), 'success');
        }, function(err) {
          msg.alert(error.data.message, 'danger');
        });
      };
    };
    var add = function(entity, collection, method, form, value) {
      var tplt = _.template('<%= key %> "<%= value %>" has been created');
      var tpltErr = _.template('<%= key %> "<%= value %>" already exists');

      return function() {
        if (form.$invalid) { return; }
        method(value).then(
          function(res) {
            collection.push(res);
            msg.alert(tplt({key: entity, value: res.name}), 'success');
          },
          function(err) {
            if (err.status === 422) {
              msg.alert(tpltErr({key: entity, value: value.name}), 'danger');
            } else {
              msg.alert(err.data.message, 'danger');
            }
          }
        );
      };
    };
    _.assign($scope, {
      topicForm: {}, teamForm: {}, userForm: {}, remoteciForm: {},
      data: data, active: {}, go: $state.go,
      topic: {}, team: {}, remoteci: {team_id: user.team.id},
      user: {
        role: 'user',
        team_id: data.teams.length && data.teams[0].id
      }
    });

    _.each(['users', 'teams', 'remotecis', 'topics', 'audits'], function(tab) {
      $scope.active[tab] = $state.is('administrate.' + tab);
    });

    $scope.role = function(value) {
      if (arguments.length) {
        return $scope.user.role = value ? 'admin' : 'user';
      } else {
        return $scope.user.role === 'admin';
      }
    };
    $scope.showError = function(form, field) {
      return field.$invalid && (field.$dirty || form.$submitted);
    };

    $scope.removeUser = rm('user', $scope.data.users, api.removeUser);
    $scope.removeTeam = rm('team', $scope.data.teams, api.removeTeam);
    $scope.removeTopic = rm('topic', $scope.data.topics, api.removeTopic);
    $scope.removeRemoteCI = rm(
      'remote CI', $scope.data.remotecis, api.removeRemoteCI
    );

    $scope.submitUser = add(
      'user', $scope.data.users, api.postUser, $scope.userForm, $scope.user
    );
    $scope.submitTeam = add(
      'team', $scope.data.teams, api.postTeam, $scope.teamForm, $scope.team
    );
    $scope.submitTopic = add(
      'topic', $scope.data.topics, api.postTopic, $scope.topicForm,
      $scope.topic
    );
    $scope.submitRemoteCI = add(
      'remote CI', $scope.data.remotecis, api.postRemoteCI,
      $scope.remoteciForm, $scope.remoteci
    );
  }
])
.controller('EditMixinCtrl', [
  '$scope', '$injector', 'obj', function($scope, $injector, obj) {
    var $state = $injector.get('$state');
    var msg = $injector.get('messages');
    var api = $injector.get('api');
    var _ = $injector.get('_');

    _.assign($scope, {obj: obj, objForm: {}});

    $scope.cancel = _.partial($state.go, obj.meta.redirect);

    $scope.showError = function(form, field) {
      return field.$invalid && (field.$dirty || form.$submitted);
    };

    $scope.update = function() {
      if ($scope.objForm.$invalid) { return; }
      $state.go(obj.meta.redirect);
      obj.meta.method($scope.obj).then(
        function(res) { msg.alert(obj.meta.msg.success, 'success'); },
        function(err) {
          if (err.status === 422) {
            msg.alert(obj.meta.msg.error);
          } else {
            msg.alert(err.data.message, 'danger');
          }
        }
      );
    };
  }
]);
