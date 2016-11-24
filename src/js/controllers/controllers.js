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
        _.partial($state.go, 'index'), function(err) { $scope.err = err; }
      );
    };
  }
])
.controller('InformationCtrl', ['$scope', 'api', function($scope, api) {
  _.each(['teams', 'topics', 'remotecis'], function(id) {
    api[id].list(null, true).then(_.partial(_.set, $scope, id));
  });
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
.controller('ListJobsCtrl',
            ['$state', '$scope', 'api', 'status', 'appCache',
             function($state, $scope, api, status, appCache) {
  var page = parseInt($state.params.page) || 1;
  var statuses = [];
  var remotes = [];

  $scope.selected = {remotecis: [], status: []};
  $scope.status = _.map(status, function(value, key) {
    value.name = key;
    return value;
  });
  if ($state.params.status) {
    statuses = _.split($state.params.status, ',');
    $scope.selected.status = _.filter($scope.status, function(iter) {
      return _.includes(statuses, iter.name);
    });
  }

  $scope.remotecis = appCache.get('remotecis');
  if (!$scope.remotecis) {
    api.remotecis.list(null, true)
      .then(function(remotecis) {
        $scope.remotecis = remotecis;
        appCache.put('remotecis', $scope.remotecis);
        var remotes = _.split($state.params.remoteci);
        $scope.selected.remotecis = _.filter($scope.remotecis, function(iter) {
          return _.includes(remotes, iter.name);
        });
      });
  } else {
    if ($state.params.remoteci) {
      remotes = _.split($state.params.remoteci, ',');
      $scope.selected.remotecis = _.filter($scope.remotecis, function(iter) {
        return _.includes(remotes, iter.name);
      });
    }
  }

  function pagination(data) {
    $scope.pagination = {
      total: data._meta.count, page: page,
      pageChanged: function() {
        $state.go('jobs', $scope.pagination);
      }
    };
    return data;
  };

  if (statuses.length || remotes.length) {
    api.jobs.search(remotes, statuses)
      .then(function(data) { $scope.jobs = data.jobs; });
  } else {
    api.jobs.list(page).then(pagination)
      .then(function(data) { $scope.jobs = data.jobs; });
  }

  $scope.retrieveLogs = function() {
    $state.go('logs', {'pattern': $scope.pattern});
  };

  $scope.filters = function() {
    var statuses = _($scope.selected.status).map('name').join(',');
    var remotes = _($scope.selected.remotecis).map('name').join(',');
    $state.go('jobs', {
      'status': statuses,
      'remoteci': remotes,
      'page': page
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
        api.jobdefinitions.tests(jobdef.id).then(function(tests) {
          jobdef.tests = tests;
        });
        jobdef.created_at_formatted = moment(jobdef.created_at)
          .local()
          .format();
        jobdef.updated_at_formatted = moment(jobdef.updated_at)
          .local()
          .format();
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
          topic.created_at_formatted = moment(topic.created_at)
            .local()
            .format();
          topic.updated_at_formatted = moment(topic.updated_at)
            .local()
            .format();
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
    var msg = $injector.get('messages');

    _.assign($scope, {objForm: {}});

    $scope.topic = topic;
    $scope.create = function(componentId) {
      if ($scope.objForm.$invalid) {
        return;
      }
      api.components.create(JSON.stringify(this.c))
        .then(
          function(res) {
            msg.alert('Create component successfully', 'success');
          },
          function(err) {
            msg.alert(err.data.message, 'danger');
          });
    };

    $scope.update = function(component) {
      if ($scope.objForm.$invalid) {
        return;
      }
      api.components.update(this.c)
        .then(
          function(res) {
            msg.alert('Component successfully updated', 'success');
          },
          function(err) {
            msg.alert(err.data.message, 'danger');
          });
    };

    api.topics.components(topic.id)
      .then(function(data) {
        $scope.componentsByTopic = {};
        _.each(data, function(component) {
          _.update($scope.componentsByTopic, component.type, function(target) {
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
])
;
