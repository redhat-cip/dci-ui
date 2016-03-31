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
        _.partial($state.go, 'index'), function(err) { $scope.err = err.data; }
      );
    };
  }
])
.controller('InformationCtrl', ['$scope', 'api', function($scope, api) {
  api.getTeams().then(_.partial(_.set, $scope, 'teams'));
  api.getTopics().then(_.partial(_.set, $scope, 'topics'));
  api.getRemoteCIS().then(_.partial(_.set, $scope, 'remotecis'));
}])
.controller('ListJobsCtrl', [
  '$state', '$scope', 'api', function($state, $scope, api) {
    var page = parseInt($state.params.page) || 1;
    var remoteci = $state.params.remoteci;
    var status = $state.params.status;

    _.assign($scope, {remotecis: {}, status: {}, isFiltering: true});

    remoteci = remoteci ? remoteci.split(',') : [];
    status = status ? status.split(',') : [];

    function pagination(data) {
      $scope.pagination = {
        total: data._meta.count, page: page,
        pageChanged: function() {
          $state.go('jobs', $scope.pagination);
        }
      };
      return data;
    };

    (remoteci.length || status.length ?
     api.searchJobs(remoteci, status) : api.getJobs(page).then(pagination)
    ).then(function(data) { $scope.jobs = data.jobs; });
    _.each(
      ['failure', 'success', 'running', 'new', 'pre-run', 'post-run'],
      function(status) {
        $scope.status[status] = _.includes($state.params.status, status);
      }
    );
    api.getRemoteCIS()
    .then(_.partialRight(_.each, function(remoteci) {
      var remoteci = remoteci.name;
      $scope.remotecis[remoteci] = _.includes($state.params.remoteci, remoteci);
    }));

    $scope.search = function() {
      $state.go('jobs', {
        'status': _($scope.status).pickBy(_.identity).keys().join(','),
        'remoteci': _($scope.remotecis).pickBy(_.identity).keys().join(','),
        'page': null
      });
    };
  }
]);
