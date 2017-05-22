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

require("app").controller("fileJunitStatusController", [
  "$scope",
  function($scope) {
    $scope.bucket = $scope.file.content.testscases;
    $scope.input = {
      passed: false,
      skipped: false,
      failure: false,
      error: false
    };

    $scope.filterjunit = function() {
      if (
        $scope.input.passed ||
        $scope.input.skipped ||
        $scope.input.failure ||
        $scope.input.error
      ) {
        $scope.bucket = _.filter($scope.file.content.testscases, function(
          testcase
        ) {
          return $scope.input[testcase.action];
        });
      } else {
        $scope.bucket = $scope.file.content.testscases;
      }
    };
  }
]);
