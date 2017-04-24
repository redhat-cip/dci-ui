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
        function($anchorScroll) {
          $anchorScroll();
        }
      ];

      $stateProvider
        .state('config', {
          'abstract': true,
          resolve: {
            conf: ['api', function(api) {
              return api.promise;
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
        .state('login', {
          parent: 'config',
          url: '/login',
          controller: 'LoginCtrl',
          templateUrl: '/partials/login.html'
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
        .state('logs', {
          parent: 'auth',
          url: '/logs?pattern',
          templateUrl: '/partials/logs.html',
          controller: 'LogsCtrl'
        })
        .state('job', {
          parent: 'auth',
          url: '/jobs/:id',
          controller: 'JobCtrl',
          templateUrl: '/partials/job.html',
          resolve: {
            job: [
              '$stateParams', '$state', 'messages', 'api', 'conf',
              function($stateParams, $state, messages, api) {
                return api.jobs.get($stateParams.id).catch(function(err) {
                  $state.go('index');
                  messages.alert(
                    err.data && err.data.message ||
                    'Something went wrong', 'danger'
                  );
                });
              }
            ]
          }
        })
        .state('job.results', {url: '/results'})
        .state('job.logs', {url: '/logs'})
        .state('job.details', {url: '/details'})
        .state('job.edit', {url: '/edit'})
        .state('job.context', {url: '/context'})
        .state('job.stackdetails', {url: '/stackdetails'})
        .state('job.issues', {url: '/issues'})
        .state('job.files', {url: '/files'})
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
              '$stateParams', '$state', 'messages', 'api',
              function($stateParams, $state, messages, api) {
                return api.topics.get($stateParams.id).catch(function(err) {
                  $state.go('index');
                  messages.alert(
                    err.data && err.data.message ||
                    'Something went wrong', 'danger');
                });
              }
            ]
          }
        })
        .state('gpanel', {
          parent: 'auth',
          url: '/gpanel',
          controller: 'GpanelIndexCtrl',
          templateUrl: '/partials/gpanel/index.html'
        })
        .state('gpanel.topic', {
          url: '/:id',
          controller: 'GpanelTopicCtrl',
          templateUrl: '/partials/gpanel/topic.html'
        })
        .state('gpanel.topic.status', {
          url: '/type/:componentType',
          controller: 'GpanelStatusCtrl',
          templateUrl: '/partials/gpanel/status.html'
        })
        .state('information', {
          parent: 'auth',
          url: '/information',
          controller: 'InformationCtrl',
          templateUrl: '/partials/information.html'
        })
        .state('adminUsers', {
          parent: 'authAdmin',
          url: '/admin/users',
          template: '<admin-users users="$resolve.users" teams="$resolve.teams"></admin-users>',
          resolve: {
            users: ['api', 'conf', function(api) {
              return api.users.list(null, true);
            }],
            teams: ['api', 'conf', function(api) {
              return api.teams.list(null, true);
            }]
          }
        })
        .state('adminUser', {
          parent: 'authAdmin',
          url: '/admin/users/:id',
          template: '<admin-user-edit user="$resolve.user" teams="$resolve.teams"></admin-user-edit>',
          resolve: {
            user: ['$stateParams', 'api', 'conf', function($stateParams, api) {
              return api.users.get($stateParams.id);
            }],
            teams: ['api', 'conf', function(api) {
              return api.teams.list(null, true);
            }]
          }
        })
        .state('adminTeams', {
          parent: 'authAdmin',
          url: '/admin/teams',
          template: '<admin-teams teams="$resolve.teams"></admin-teams>',
          resolve: {
            teams: ['api', 'conf', function(api) {
              return api.teams.list(null, true);
            }]
          }
        })
        .state('adminTeam', {
          parent: 'authAdmin',
          url: '/admin/teams/:id',
          template: '<admin-team-edit team="$resolve.team"></admin-team-edit>',
          resolve: {
            team: ['$stateParams', 'api', 'conf', function($stateParams, api) {
              return api.teams.get($stateParams.id);
            }]
          }
        })
        .state('adminRemotecis', {
          parent: 'authAdmin',
          url: '/admin/remotecis',
          template: '<admin-remotecis remotecis="$resolve.remotecis"></admin-remotecis>',
          resolve: {
            remotecis: ['api', 'conf', function(api) {
              return api.remotecis.list(null, true);
            }]
          }
        })
        .state('adminRemoteci', {
          parent: 'authAdmin',
          url: '/admin/remotecis/:id',
          template: '<admin-remoteci-edit remoteci="$resolve.remoteci"></admin-remoteci-edit>',
          resolve: {
            remoteci: ['$stateParams', 'api', 'conf', function($stateParams, api) {
              return api.remotecis.get($stateParams.id);
            }]
          }
        })
        .state('adminTopics', {
          parent: 'authAdmin',
          url: '/admin/topics',
          template: '<admin-topics topics="$resolve.topics"></admin-topics>',
          resolve: {
            topics: ['api', 'conf', function(api) {
              return api.topics.list(null, true);
            }]
          }
        })
        .state('adminTopic', {
          parent: 'authAdmin',
          url: '/admin/topics/:id',
          template: '<admin-topic-edit topic="$resolve.topic" teams="$resolve.teams" topic-teams="$resolve.topicTeams"></admin-topic-edit>',
          resolve: {
            topic: ['$stateParams', 'api', 'conf', function($stateParams, api) {
              return api.topics.get($stateParams.id);
            }],
            topicTeams: ['$stateParams', 'api', 'conf', function($stateParams, api) {
              return api.topics.teams($stateParams.id);
            }],
            teams: ['api', 'conf', function(api) {
              return api.teams.list(null, true);
            }]
          }
        })
        .state('adminAudits', {
          parent: 'authAdmin',
          url: '/admin/audits',
          template: '<admin-audits audits="$resolve.audits"></admin-audits>',
          resolve: {
            audits: ['api', 'conf', function(api) {
              return api.audits.list(null, true);
            }]
          }
        });

      $urlRouterProvider.otherwise('/');
    }
  ])
  .run([
    '$rootScope', '$state', '$log', function($rootScope, $state, $log) {
      $rootScope.$on('$stateChangeError', function(e, tS, tPs, fS, fPs, err) {
        if (err.status === 401) {
          $state.go('login', {}, {reload: true});
        } else if (err.status === 301) {
          $state.go('jobs', {}, {reload: true, inherit: false});
        } else {
          $log.error(err);
        }
      });
    }
  ]);
