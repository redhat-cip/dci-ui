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
  _.each(['teams', 'topics'], function(id) {
    api[id].list(null, true).then(_.partial(_.set, $scope, id));
  });

  api.remotecis.list(null, true).then(_.partial(_.set, $scope, 'remotecis'))
    .then(function() {
      _.each($scope.remotecis, function(remoteci) {
        api.jobs.remoteci.latest(remoteci.id).then(function(job) {
          remoteci.updated_at = job.updated_at;
        });
      });
    }
  );
}])
.controller('LogsCtrl', [
  '$state', '$scope', '$q', 'api', 'status',
  function($state, $scope, $q, api, status) {
    $scope.pattern = $state.params.pattern;

    $scope.retrieveLogs = function() {
      $state.go('logs', {'pattern': $scope.pattern});
    };

    $scope.status = function(log) {
      if (!log.job) { return 'panel-default'; }
      return 'panel-' + status[log.job.status].color;
    };

    if (!$scope.pattern) { return; }

    $scope.search = api.search.create($state.params.pattern)
      .then(function(res) {
        $scope.logs = res.logs.hits;

        return $q.all(_.map($scope.logs, function(log) {
          log = log._source;
          if (log.job_id) {
            return api.jobs.get(log.job_id, true);
          } else {
            return api.jobstates.get(log.jobstate_id).then(_.property('job'));
          }
        }));
      })
      .then(function(res) {
        _.each(_.zip($scope.logs, res), _.spread(function(log, job) {
          log.job = job;
        }));
      });
  }
])
.controller('ListJobsCtrl', [
  '$state', '$scope', 'api', function($state, $scope, api) {
    var page = parseInt($state.params.page) || 1;
    var remoteci = $state.params.remoteci;
    var status = $state.params.status;

    _.assign($scope, {status: {}, isFiltering: true});

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
     api.jobs.search(remoteci, status) : api.jobs.list(page).then(pagination)
    )
    .then(function(data) { $scope.jobs = data.jobs; });

    _.each(
      ['failure', 'success', 'running', 'new', 'pre-run', 'post-run', 'killed'],
      function(status) {
        $scope.status[status] = _.includes($state.params.status, status);
      }
    );
    api.remotecis.list(null, true)
    .then(function(remotecis) {
      $scope.remotecis = _.map(remotecis, function(remoteci) {
        return {
          name: remoteci.name,
          search: _.includes($state.params.remoteci, remoteci.name)
        };
      });
    });
    $scope.retrieveLogs = function() {
      $state.go('logs', {'pattern': $scope.pattern});
    };

    $scope.search = function() {
      $state.go('jobs', {
        'status': _($scope.status).pickBy(_.identity).keys().join(','),
        'remoteci': _($scope.remotecis).filter('search').map('name').join(','),
        'page': null
      });
    };
  }
])
.controller('ListJobDefsCtrl', [
  '$injector', '$scope', function($injector, $scope) {
    var $state = $injector.get('$state');
    var moment = $injector.get('moment');
    var api = $injector.get('api');

    var page = parseInt($state.params.page) || 1;
    api.jobdefinitions.list(page)
    .then(function(data) {
      $scope.jobdefs = data.jobdefinitions;
      _.each(data.jobdefinitions, function(jobdef) {
        jobdef.created_at = moment(jobdef.created_at).local().format();
      });
      $scope.pagination = {
        total: data._meta.count, page: page,
        pageChanged: function() {
          $state.go('jobdefs', $scope.pagination);
        }
      };

    });
  }
])
.controller('ListTopicsCtrl', [
  '$injector', '$scope', function($injector, $scope) {
    var $state = $injector.get('$state');
    var moment = $injector.get('moment');
    var api = $injector.get('api');
    var page = parseInt($state.params.page) || 1;

    api.topics.list(page)
      .then(function(data) {
        $scope.topics = data.topics;
        _.each(data.topics, function(topic) {
          topic.created_at = moment(topic.created_at).local().format();
        });
        $scope.pagination = {
          total: data._meta.count,
          page: page,
          pageChanged: function() {
            $state.go('topics', $scope.pagination);
          }
        };
      });
  }
])
.controller('ListComponentsCtrl',[
  '$injector', '$scope', 'topic', function($injector, $scope, topic) {
    var api = $injector.get('api');
    var moment = $injector.get('moment');

    $scope.topic = topic;
    api.topics.components(topic.id)
      .then(function(data) {
        $scope.componentsByTopic = {};
        _.each(data, function(component) {
          _.update($scope.componentsByTopic, component.type, function(target) {
            component.created_at = moment(component.created_at);
            return _.concat(target || [], component);
          });
        });
      });
  }
])
;
