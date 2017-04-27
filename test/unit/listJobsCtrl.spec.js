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

describe("ListJobsCtrl", function() {
  var $controller, $rootScope;

  beforeEach(
    inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    })
  );

  it("should get jobs", function() {
    var scope = $rootScope.$new();
    $controller("ListJobsCtrl", { $scope: scope });
    $httpBackend
      .expectGET(
        "https://api.example.org/api/v1/jobs?embed=remoteci,jobdefinition,jobdefinition.tests,results&limit=20&offset=0"
      )
      .respond({ _meta: { count: 1 }, jobs: [{ id: 1 }] });
    $httpBackend.flush();
    expect(scope.jobs.length).toBe(1);
  });

  it("should get jobs for every status", function() {
    var state = { params: { status: "failure,killed" } };
    var scope = $rootScope.$new();
    $controller("ListJobsCtrl", { $scope: scope, $state: state });
    $httpBackend
      .expectGET(
        "https://api.example.org/api/v1/jobs?embed=remoteci,jobdefinition,jobdefinition.tests,results&limit=20&offset=0&where=status:failure"
      )
      .respond({ _meta: { count: 2 }, jobs: [{ id: 1 }, { id: 2 }] });
    $httpBackend
      .expectGET(
        "https://api.example.org/api/v1/jobs?embed=remoteci,jobdefinition,jobdefinition.tests,results&limit=20&offset=0&where=status:killed"
      )
      .respond({ _meta: { count: 1 }, jobs: [{ id: 3 }] });
    $httpBackend.flush();
    expect(scope.jobs.length).toBe(3);
  });

  it("should get jobs for page", function() {
    var state = { params: { page: "3" } };
    var scope = $rootScope.$new();
    $controller("ListJobsCtrl", { $scope: scope, $state: state });
    $httpBackend
      .expectGET(
        "https://api.example.org/api/v1/jobs?embed=remoteci,jobdefinition,jobdefinition.tests,results&limit=20&offset=40"
      )
      .respond({ _meta: { count: 2 }, jobs: [{ id: 1 }, { id: 2 }] });
    $httpBackend.flush();
    expect(scope.jobs.length).toBe(2);
  });
});
