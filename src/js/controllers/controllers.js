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
  '$scope', 'data', 'api', 'messages', function($scope, data, api, msg) {

    var errCb = function(entity, value) {
      return function(error) {
        if (error.status === 422) {
          msg.alert(entity + ' "' + value + '" already exists', 'danger');
        } else {
          msg.alert(error.data.message, 'danger');
        }
      };
    };

    $scope.topicForm = {};
    $scope.teamForm = {};
    $scope.userForm = {};
    $scope.remoteciForm = {};
    $scope.topics = data.topics;
    $scope.remotecis = data.remotecis;
    $scope.teams = data.teams;
    $scope.users = data.users;
    $scope.topic = {};
    $scope.remoteci = {};
    $scope.team = {};
    $scope.user = {
      admin: false,
      team: data.teams.length && data.teams[0].id
    };

    $scope.showError = function(form, field) {
      return field.$invalid && (field.$dirty || form.$submitted);
    };

    $scope.remove_user = function(user, index) {
      $scope.user_name = user.name;
      api.removeUser(user.id, user.etag).then(function(user) {
        $scope.users.splice(index, 1);
        msg.alert('user "' + $scope.user_name + '" has been removed',
                  'success');
      }, errCb('user', $scope.user.name));
    };

    $scope.remove_team = function(team, index) {
      $scope.team_name = team.name;
      api.removeTeam(team.id, team.etag).then(function(team) {
        $scope.teams.splice(index, 1);
        msg.alert('team "' + $scope.team_name + '" has been removed',
                  'success');
      }, errCb('team', $scope.team.name));
    };

    $scope.remove_topic = function(topic, index) {
      $scope.topic_name = topic.name;
      api.removeTopic(topic.id, topic.etag).then(function(topic) {
        $scope.topics.splice(index, 1);
        msg.alert('topic "' + $scope.topic_name + '" has been removed',
                  'success');
      }, errCb('topic', $scope.topic.name));
    };

    $scope.remove_remoteci = function(remoteci, index) {
      $scope.remoteci_name = remoteci.name;
      api.removeRemoteCI(remoteci.id, remoteci.etag).then(function(remoteci) {
        $scope.remotecis.splice(index, 1);
        msg.alert('remoteci "' + $scope.remoteci_name + '" has been removed',
                  'success');
      }, errCb('remoteci', $scope.remoteci.name));
    };

    $scope.submitUser = function() {
      if ($scope.userForm.$invalid) { return; }
      var user = {
        name: $scope.user.name,
        password: $scope.user.password,
        role: $scope.user.admin ? 'admin' : 'user',
        team_id: $scope.user.team
      };

      api.postUser(user).then(
        function(user) {
          $scope.users.push(user);
          msg.alert(
            'user "' + user.name + '" has been created',
            'success');
        }, errCb('user', user.name)
      );
    };

    $scope.submitTeam = function() {
      if ($scope.teamForm.$invalid) { return; }
      api.postTeam({name: $scope.team.name}).then(
        function(team) {
          $scope.teams.push(team);
          msg.alert('team "' + team.name + '" has been created', 'success');
        }, errCb('team', $scope.team.name)
      );
    };

    $scope.submitRemoteCI = function() {
      if ($scope.remoteciForm.$invalid) { return; }
      api.postRemoteCI({name: $scope.remoteci.name}).then(
        function(remoteci) {
          $scope.remotecis.push(remoteci);
          msg.alert('remoteci "' + remoteci.name + '" has been created',
                    'success');
        }, errCb('remoteci', $scope.remoteci.name)
      );
    };

    $scope.submitTopic = function() {
      if ($scope.topicForm.$invalid) { return; }
      api.postTopic({name: $scope.topic.name}).then(
        function(topic) {
          $scope.topics.push(topic);
          msg.alert('topic "' + topic.name + '" has been created', 'success');
        }, errCb('topic', $scope.topic.name)
      );
    };

  }
]);
