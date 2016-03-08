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
.controller('LoginCtrl', [
  '$scope', '$state', 'auth', function($scope, $state, auth) {
    $scope.authenticate = function(credentials) {
      auth.login(credentials.username, credentials.password).then(
        function() {
          $state.go('index');
        },
        function(err) {
          $scope.err = err.data;
        }
      );
    };
  }
])

.controller('InformationCtrl', [
  '$scope',  'teams', 'topics', 'remotecis',
  function($scope, teams, topics, remotecis) {
    $scope.teams = teams;
    $scope.topics = topics;
    $scope.remotecis = remotecis;
  }
])
.controller('ListJobsCtrl', [
  '$injector', '$scope', 'jobs', 'remotecis', 'page',
  function($injector, $scope, jobs, remotecis, page) {
    var _ = $injector.get('_');
    var $state = $injector.get('$state');
    var statuses = ['failure', 'success', 'running', 'new',
                    'pre-run', 'post-run'];
    $scope.jobs = jobs.jobs;
    $scope.remotecis = {};
    $scope.status = {};
    _.each(statuses, function(status) {
      $scope.status[status] = _.includes($state.params.status, status);
    });

    _.each(remotecis, function(remoteci) {
      var remoteci = remoteci.name;
      $scope.remotecis[remoteci] = _.includes($state.params.remoteci, remoteci);
    });

    $scope.search = function() {
      var params = {
        'status': _($scope.status).pick(_.identity).keys().join(','),
        'remoteci': _($scope.remotecis).pick(_.identity).keys().join(',')
      };
      $state.go('jobs', params);
    };

    $scope.isFiltering = true;

    if (!$scope.isFiltering) {
      $scope.pagination = {
        total: jobs._meta.count, page: page,
        pageChanged: function() {
          $state.go('jobs', $scope.pagination);
        }
      };
    }
  }
])
.controller('AdminCtrl', [
  '$scope', '$injector', 'data', function($scope, $injector, data) {

    var api = $injector.get('api');
    var user = $injector.get('user');
    var msg = $injector.get('messages');
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
      data: data,
      topic: {}, team: {}, remoteci: {team_id: user.team.id},
      user: {
        role: 'user',
        team_id: data.teams.length && data.teams[0].id
      }
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
]);
