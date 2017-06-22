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

require("app").controller("JobCtrl", [
  "$scope",
  "$state",
  "job",
  "api",
  "status",
  function($scope, $state, job, api, status) {
    $scope.$state = $state;
    $scope.collapses = { remoteci: false, jobdefinition: false };

    job.configuration = angular.fromJson(job.configuration);
    $scope.job = job;

    _.each(job.jobstates, function(jobstate) {
      jobstate.statusClass = "bs-callout-" + status[jobstate.status].color;
    });

    $scope.retrieveFiles = function(jobstate) {
      jobstate.isOpen = !jobstate.isOpen;
      _.each(jobstate.files, function(file) {
        api.files.content(file.id).then(function(res) {
          file.content = res.data;
        });
      });
    };

    api.jobs.metas(job.id).then(function(metas) {
      $scope.metas = metas;
    });

    api.jobdefinitions.tests(job.jobdefinition.id).then(function(tests) {
      $scope.jtests = tests;
    });

    api.remotecis.tests(job.remoteci.id).then(function(tests) {
      $scope.rtests = tests;
    });

    api.jobs.files(job.id).then(function(files) {
      $scope.files = files;
    });

    api.jobs.results(job.id).then(function(data) {
      $scope.junit_files = data;
    });
  }
]);
