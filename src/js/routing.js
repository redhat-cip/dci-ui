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
.config([
  '$stateProvider', '$urlRouterProvider', 'utils',
  function($stateProvider, $urlRouterProvider, utils) {
    var scrollTop = ['$anchorScroll',
      function($anchorScroll) { $anchorScroll(); }
    ];

    $stateProvider
    .state('config', {
      'abstract': true,
      resolve: {
        conf: ['config', function(config) {
          return config.promise;
        }]
      },
      template: '<ui-view></ui-view>'
    })
    .state('auth', {
      'abstract': true,
      parent: 'config',
      resolve: {
        _: ['auth', '$q', function(auth, $q) {
          if (!auth.isAuthenticated()) {
            return $q.reject({status: 401});
          }
        }]
      },
      controller: 'authCtrl',
      templateUrl: '/partials/auth.html'
    })
    .state('authAdmin', {
      'abstract': true,
      parent: 'auth',
      template: '<ui-view></ui-view>',
      resolve: {
        _: ['auth', '$q', function(auth, $q) {
          if (!auth.isAdminInTeam()) {
            return $q.reject({status: 401});
          }
        }]
      }
    })
    .state('index', {
      url: '/',
      parent: 'auth',
      resolve: {
        _: ['$q', function($q) {
          return $q.reject({status: 301});
        }]
      }
    })
    .state('jobs', {
      parent: 'auth',
      url: '/jobs?status&remoteci&page',
      onEnter: scrollTop,
      templateUrl: '/partials/jobs.html',
      controller: 'ListJobsCtrl'
    })
    .state('job', {
      parent: 'auth',
      url: '/jobs/:id',
      controller: 'JobCtrl',
      templateUrl: '/partials/job.html',
      resolve: {
        job: [
          '$injector', '$stateParams', 'conf',
          function($injector, $stateParams) {
            var api = $injector.get('api');

            return api.jobs.get($stateParams.id).catch(function(err) {
              $injector.get('$state').go('index');
              $injector.get('messages').alert(
                err.data && err.data.message ||
                  'Something went wrong', 'danger'
              );
            });
          }
        ]
      }
    })
    .state('job.results', {url: '/results'})
    .state('job.files', {url: '/files'})
    .state('job.details', {url: '/details'})
    .state('job.edit', {url: '/edit'})
    .state('job.context', {url: '/context'})
    .state('job.stackdetails', {url: '/stackdetails'})
    .state('jobdefs', {
      parent: 'auth',
      url: '/job-definitions?page',
      onEnter: scrollTop,
      controller: 'ListJobDefsCtrl',
      templateUrl: '/partials/jobdefs.html'
    })
    .state('topics', {
      parent: 'auth',
      url: '/topics?page',
      onEnter: scrollTop,
      controller: 'ListTopicsCtrl',
      templateUrl: '/partials/topics.html'
    })
    .state('topic', {
      parent: 'auth',
      url: '/topics/:id',
      templateUrl: '/partials/topic.html',
      controller: 'ListComponentsCtrl',
      resolve: {
        topic: [
          '$injector', '$stateParams', 'conf',
          function($injector, $stateParams) {
            var api = $injector.get('api');

            return api.topics.get($stateParams.id).catch(function(err) {
              $injector.get('$state').go('index');
              $injector.get('messages').alert(
                err.data && err.data.message ||
                  'Something went wrong', 'danger');
            });
          }
        ]
      }
    })
    .state('gpanel', {
      parent: 'authAdmin',
      url: '/gpanel',
      controller: 'GpanelTopicCtrl',
      templateUrl: '/partials/gpanel.html',
    })
    .state('gpaneltopic', {
      parent: 'auth',
      url: '/gpanel/:id',
      controller: 'GpanelCompoCtrl',
      templateUrl: '/partials/gpanelcompo.html',
      resolve: {
        topic: ['$stateParams', 'conf', function($stateParams) {
          return $stateParams.id;
        }]
      }
    })
    .state('gpanelstatus', {
      parent: 'auth',
      url: '/gpanel/:id/type/:componentType',
      controller: 'GpanelStatusCtrl',
      templateUrl: '/partials/gpanelstatus.html',
      resolve: {
        topic: ['$stateParams', 'conf', function($stateParams) {
          return $stateParams.id;
        }],
        componentType: ['$stateParams', 'conf', function($stateParams) {
          return $stateParams.componentType;
        }]
      }
    })
    .state('administrate', {
      parent: 'authAdmin',
      url: '/administrate',
      controller: 'AdminCtrl',
      templateUrl: '/partials/admin.html'
    })
    .state('administrate.users', {url: '/users'})
    .state('administrate.teams', {url: '/teams'})
    .state('administrate.remotecis', {url: '/remotecis'})
    .state('administrate.topics', {url: '/topics'})
    .state('administrate.audits', {url: '/audits'})
    .state('edit', {
      'abstract': true,
      parent: 'authAdmin',
      template: '<ui-view></ui-view>'
    })
    .state('edit.user', (function() {
      function EditUser() { utils.Edit.call(this, 'User'); }
      EditUser.prototype = Object.create(utils.Edit.prototype);
      EditUser.prototype.constructor = EditUser;

      EditUser.prototype.cb = function($stateParams, $injector) {
        var api = $injector.get('api');
        return $injector.get('$q').all([
          api.users.get($stateParams.id, true), api.teams.list(null, true)
        ]).then(
        this.successCb($injector), this.errorCb($injector)
        );
      };
      EditUser.prototype.successCb = function($injector) {
        var that = this;
        return function(res) {
          return _.merge(
            utils.Edit.prototype.successCb.call(that, $injector)(res[0]),
            {role: res[0].role === 'admin'},
            {meta: {teams: res[1]}}
          );
        };
      };
      EditUser.prototype.errorCb = function($injector) {
        return function(errs) {
          _.each(errs, _.partial(utils.Edit.prototype.errorCb(that)));
        };
      };
      return (new EditUser()).genState();
    })())
    .state('edit.team', (new utils.Edit('Team').genState()))
    .state('edit.remoteci', (new utils.Edit('RemoteCI')).genState())
    .state('edit.topic', (function() {
      function EditTopic() { utils.Edit.call(this, 'Topic'); }
      EditTopic.prototype = Object.create(utils.Edit.prototype);
      EditTopic.prototype.constructor = EditTopic;

      EditTopic.prototype.cb = function($stateParams, $injector) {
        var api = $injector.get('api');
        return $injector.get('$q').all([
          api.topics.get($stateParams.id),
          api.teams.list(null, true),
          api.topics.teams($stateParams.id)
        ])
        .then(this.successCb($injector), this.errorCb($injector));
      };
      EditTopic.prototype.successCb = function($injector) {
        var that = this;
        return function(res) {
          return _.merge(
            utils.Edit.prototype.successCb.call(that, $injector)(res[0]),
            {meta: {teams: res[1]}}, {teams: res[2]}
          );
        };
      };
      EditTopic.prototype.errorCb = function($injector) {
        return function(errs) {
          _.each(errs, _.partial(utils.Edit.prototype.errorCb(that)));
        };
      };
      return (new EditTopic()).genState();

    })())
    .state('information', {
      parent: 'auth',
      url: '/information',
      controller: 'InformationCtrl',
      templateUrl: '/partials/information.html',
    })
    .state('login', {
      parent: 'config',
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: '/partials/login.html',
    });

    $urlRouterProvider.otherwise('/');
  }
])

.controller('authCtrl', [
  '$scope', '$state', 'auth', 'config',
  function($scope, $state, auth, config) {
    // currently just create roles and user when admin
    $scope.version = config.version;
    $scope.admin = auth.isAdminInTeam();
    $scope.global_admin = auth.isAdmin();
    $scope.user = auth.user;
    $scope.isCollapsed = true;
    $scope.logout = function() {
      auth.logout();
      $state.go('login');
    };
  }
])

.run([
  '$rootScope', '$state', '$log', function($rootScope, $state, $log) {
    $rootScope.$on('$stateChangeError', function(e, tS, tPs, fS, fPs, err) {
      if (err.status === 401) {
        $state.go('login', {}, {reload: true});
      } else if (err.status == 301) {
        $state.go('jobs', {}, {reload: true, inherit: false});
      } else {
        $log.error(err);
      }
    });
  }
]);
