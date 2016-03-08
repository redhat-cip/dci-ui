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
  '$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
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
      controller: 'ListJobsCtrl',
      resolve: {
        page: ['$stateParams', function($stateParams) {
          return parseInt($stateParams.page) || 1;
        }],
        jobs: [
          '$stateParams', 'api', 'page', 'conf',
          function($stateP, api, page, _) {
            var remoteci = $stateP.remoteci;
            var status = $stateP.status;

            $stateP.remoteci = remoteci = remoteci ? remoteci.split(',') : [];
            $stateP.status = status = status ? status.split(',') : [];
            if (remoteci.length || status.length) {
              return api.searchJobs(remoteci, status);
            } else {
              return api.getJobs(page);
            }
          }
        ],
        remotecis: ['api', 'conf', function(api, _) {
          return api.getRemoteCIS();
        }]
      }
    })
    .state('job', {
      parent: 'auth',
      url: '/jobs/:id',
      controller: 'JobCtrl',
      templateUrl: '/partials/job.html',
      resolve: {
        job: ['$stateParams', 'api', 'conf', function($stateParams, api, _) {
          return api.getJob($stateParams.id);
        }]
      }
    })
    .state('administrate', {
      parent: 'authAdmin',
      url: '/administrate',
      controller: 'AdminCtrl',
      templateUrl: '/partials/admin.html',
      resolve: {
        remotecis: ['api', 'conf', function(api, _) {
          return api.getRemoteCIS();
        }],
        teams: ['api', 'conf', function(api, _) {
          return api.getTeams();
        }],
        topics: ['api', 'conf', function(api, _) {
          return api.getTopics();
        }],
        users: ['api', 'conf', function(api, _) {
          return api.getUsers();
        }],
        audits: ['api', 'conf',  function(api) {
          return api.getAudits();
        }]
      }
    })
    .state('informations', {
      parent: 'auth',
      url: '/informations',
      controller: 'InformationCtrl',
      templateUrl: '/partials/informations.html',
      resolve: {
        teams: ['api', 'conf', function(api, _) {
          return api.getTeams();
        }],
        topics: ['api', 'conf', function(api, _) {
          return api.getTopics();
        }],
        remotecis: ['api', 'conf', function(api, _) {
          return api.getRemoteCIS();
        }],
      }
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
