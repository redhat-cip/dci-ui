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

    var edit = function(title) {
      var plural = title.toLowerCase() + 's';
      var successMsg = title + ' has been updated';
      var errorMsg = title + ' has failed updating';
      var errorCb = function(err) {
        $injector.get('messages').alert(
          err.data && err.data.message || 'Something went wrong', 'danger'
        );
      };
      var obj = ['$stateParams','api', 'conf', function($stateParams, api) {
        return api['get' + title]($stateParams.id).then(
          function(res) {
            res.meta = {
              redirect: 'administrate.' + plural, method: api['put' + title],
              msg: {success: successMsg, error: errorMsg}
            };
            return res;
          },
          errorCb);
      }];

      return {
        url: '/administrate/' + plural + '/:id',
        templateUrl: '/partials/admin/' + plural + 'Edit.html',
        controller: 'EditMixinCtrl', resolve: {obj: obj}, errorCb: errorCb
      };
    };

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
        job: [
          '$injector', '$stateParams', 'conf',
          function($injector, $stateParams) {
            var api = $injector.get('api');

            return api.getJob($stateParams.id).catch(function(err) {
                $injector.get('$state').go('index');
                $injector.get('messages').alert(
                  err.data && err.data.message ||
                  'Something went wrong', 'danger'
                );
              }
            );
          }
        ]
      }
    })
    .state('job.files', {url: '/files'})
    .state('job.details', {url: '/details'})
    .state('job.edit', {url: '/edit'})
    .state('job.context', {url: '/context'})
    .state('job.metrics', {url: '/metrics'})
    .state('administrate', {
      parent: 'authAdmin',
      url: '/administrate',
      controller: 'AdminCtrl',
      templateUrl: '/partials/admin.html',
      resolve: {
        data: ['$q', 'api', 'conf', function($q, api) {
          return $q.all([api.getRemoteCIS(), api.getTeams(),
                         api.getTopics(), api.getUsers(), api.getAudits()])
          .then(function(results) {
            return {
              'remotecis': results[0],
              'teams': results[1],
              'topics': results[2],
              'users': results[3],
              'audits': results[4]
            };
          });
        }]
      }
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
      var stateConfig = edit('User');
      var successMsg = 'User has been updated';
      var errorMsg = 'User has failed updating';

      stateConfig.resolve.obj = [
        '$stateParams', '$q', 'api', 'conf', function($stateParams, $q, api) {
          return $q.all([api.getUser($stateParams.id, true), api.getTeams()])
          .then(
            function(results) {
              var res = results[0];
              res.role = res.role === 'admin';
              res.meta = {
                redirect: 'administrate.users', method: api.putUser,
                teams: results[1], msg: {success: successMsg, error: errorMsg},
              };
              return res;
            },
            function(errors) {
              angular.forEach(errors, function(error) {
                stateConfig.errorCb(error);
              });
            }
          );
        }
      ];
      return stateConfig;
    })())
    .state('edit.team', edit('Team'))
    .state('edit.remoteci', edit('RemoteCI'))
    .state('edit.topic', edit('Topic'))
    .state('information', {
      parent: 'auth',
      url: '/information',
      controller: 'InformationCtrl',
      templateUrl: '/partials/information.html',
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
