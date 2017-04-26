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

require("app")
  .controller("IssueCtrl", [
    "$scope",
    "api",
    function($scope, api) {
      $scope.submit = function() {
        api.issues.create($scope.job.id, $scope.issue).then(function(issues) {
          $scope.job.issues.push(_.last(issues));
          $scope.issue = null;
        });
      };

      $scope.remove = function(job, issue) {
        return api.issues.remove(job.id, issue.id, issue.etag).then(function() {
          _.pullAt(job.issues, _.findIndex(job.issues, ["id", issue.id]));
        });
      };
    }
  ])
  .filter("titlecase", function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    };
  })
  .filter("point", function() {
    return function(input) {
      return input + (input.charAt(input.length - 1) === "." ? "" : ".");
    };
  });
