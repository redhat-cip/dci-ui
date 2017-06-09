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

"use strict";

var _ = require("lodash");

require("app")
  .config([
    "$stateProvider",
    "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state("login", {
          url: "/login",
          template: "<dci-login></dci-login>",
          data: {
            loginRequired: false
          }
        })
        .state("index", {
          url: "/",
          redirectTo: "jobs"
        })
        .state("jobs", {
          url: "/jobs?status&remoteci&page",
          templateUrl: "/partials/jobs.html",
          controller: "ListJobsCtrl"
        })
        .state("logs", {
          url: "/logs?pattern",
          templateUrl: "/partials/logs.html",
          controller: "LogsCtrl"
        })
        .state("job", {
          url: "/jobs/:id",
          controller: "JobCtrl",
          templateUrl: "/partials/job.html",
          resolve: {
            job: [
              "$stateParams",
              "$state",
              "messages",
              "api",
              function($stateParams, $state, messages, api) {
                return api.jobs.get($stateParams.id).catch(function(err) {
                  $state.go("index");
                  messages.alert(
                    (err.data && err.data.message) || "Something went wrong",
                    "danger"
                  );
                });
              }
            ]
          }
        })
        .state("job.results", { url: "/results" })
        .state("job.logs", { url: "/logs" })
        .state("job.details", { url: "/details" })
        .state("job.edit", { url: "/edit" })
        .state("job.stackdetails", { url: "/stackdetails" })
        .state("job.issues", { url: "/issues" })
        .state("job.files", { url: "/files" })
        .state("jobdefs", {
          url: "/job-definitions?page",
          controller: "ListJobDefsCtrl",
          templateUrl: "/partials/jobdefs.html"
        })
        .state("topics", {
          url: "/topics?page",
          controller: "ListTopicsCtrl",
          templateUrl: "/partials/topics.html"
        })
        .state("topic", {
          url: "/topics/:id",
          templateUrl: "/partials/topic.html",
          controller: "ListComponentsCtrl",
          resolve: {
            topic: [
              "$stateParams",
              "$state",
              "messages",
              "api",
              function($stateParams, $state, messages, api) {
                return api.topics.get($stateParams.id).catch(function(err) {
                  $state.go("index");
                  messages.alert(
                    (err.data && err.data.message) || "Something went wrong",
                    "danger"
                  );
                });
              }
            ]
          }
        })
        .state("globalStatus", {
          url: "/globalStatus",
          template: '<global-status topics="$resolve.topics"></global-status>',
          resolve: {
            topics: [
              "$q",
              "api",
              function($q, api) {
                return api.topics.list(null, true).then(function(topics) {
                  var promises = [];
                  _.each(topics, function(topic) {
                    promises.push(api.topics.jobs(topic.id));
                  });
                  return $q.all(promises).then(function(values) {
                    for (var i = 0; i < values.length; i++) {
                      topics[i].jobs = values[i];
                    }
                    return topics;
                  });
                });
              }
            ]
          }
        })
        .state("adminUsers", {
          url: "/admin/users",
          template: '<admin-users users="$resolve.users"></admin-users>',
          resolve: {
            users: [
              "api",
              function(api) {
                return api.users.list(null, true);
              }
            ]
          }
        })
        .state("adminUserCreate", {
          url: "/admin/users/create",
          template: "<admin-user-create></admin-user-create>"
        })
        .state("adminUserEdit", {
          url: "/admin/users/:id",
          template: '<admin-user-edit user="$resolve.user"></admin-user-edit>',
          resolve: {
            user: [
              "$stateParams",
              "api",
              function($stateParams, api) {
                return api.users.get($stateParams.id);
              }
            ]
          }
        })
        .state("adminTeams", {
          url: "/admin/teams",
          template: '<admin-teams teams="$resolve.teams"></admin-teams>',
          resolve: {
            teams: [
              "api",
              function(api) {
                return api.teams.list(null, true);
              }
            ]
          }
        })
        .state("adminTeamCreate", {
          url: "/admin/teams/create",
          template: "<admin-team-create></admin-team-create>"
        })
        .state("adminTeamEdit", {
          url: "/admin/teams/:id",
          template: '<admin-team-edit team="$resolve.team"></admin-team-edit>',
          resolve: {
            team: [
              "$stateParams",
              "api",
              function($stateParams, api) {
                return api.teams.get($stateParams.id);
              }
            ]
          }
        })
        .state("adminRemotecis", {
          url: "/admin/remotecis",
          template:
            '<admin-remotecis remotecis="$resolve.remotecis"></admin-remotecis>',
          resolve: {
            remotecis: [
              "api",
              function(api) {
                return api.remotecis.list(null, true);
              }
            ]
          }
        })
        .state("adminRemoteciCreate", {
          url: "/admin/remotecis/create",
          template: "<admin-remoteci-create></admin-remoteci-create>"
        })
        .state("adminRemoteciEdit", {
          url: "/admin/remotecis/:id",
          template:
            '<admin-remoteci-edit remoteci="$resolve.remoteci"></admin-remoteci-edit>',
          resolve: {
            remoteci: [
              "$stateParams",
              "api",
              function($stateParams, api) {
                return api.remotecis.get($stateParams.id);
              }
            ]
          }
        })
        .state("adminTopics", {
          url: "/admin/topics",
          template: '<admin-topics topics="$resolve.topics"></admin-topics>',
          resolve: {
            topics: [
              "api",
              function(api) {
                return api.topics.list(null, true);
              }
            ]
          }
        })
        .state("adminTopicCreate", {
          url: "/admin/topics/create",
          template: "<admin-topic-create></admin-topic-create>"
        })
        .state("adminTopicEdit", {
          url: "/admin/topics/:id",
          template:
            '<admin-topic-edit topic="$resolve.topic" teams="$resolve.teams" topic-teams="$resolve.topicTeams"></admin-topic-edit>',
          resolve: {
            topic: [
              "$stateParams",
              "api",
              function($stateParams, api) {
                return api.topics.get($stateParams.id);
              }
            ],
            topicTeams: [
              "$stateParams",
              "api",
              function($stateParams, api) {
                return api.topics.teams($stateParams.id);
              }
            ],
            teams: [
              "api",
              function(api) {
                return api.teams.list(null, true);
              }
            ]
          }
        })
        .state("adminAudits", {
          url: "/admin/audits",
          template: '<admin-audits audits="$resolve.audits"></admin-audits>',
          resolve: {
            audits: [
              "api",
              function(api) {
                return api.audits.list(null, true);
              }
            ]
          }
        })
        .state("statsMetrics", {
          url: "/metrics/topics?selected&range",
          template: "<topics-metrics></topics-metrics>"
        });

      $urlRouterProvider.otherwise("/");
    }
  ])
  .run([
    "$transitions",
    "auth",
    function($transitions, auth) {
      $transitions.onStart({}, function(transition) {
        var data = transition.$to().data || {};
        var loginRequired = typeof data.loginRequired === "undefined"
          ? true
          : data.loginRequired;
        if (loginRequired && !auth.isAuthenticated()) {
          return transition.router.stateService.target("login");
        }
      });
    }
  ]);
