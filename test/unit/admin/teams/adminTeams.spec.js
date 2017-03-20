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

describe('admin teams component', function() {
  var parentScope;
  var element;
  var controller;

  beforeEach(inject(function($rootScope, $compile) {
    $httpBackend
      .when('GET', 'https://api.example.org/api/v1/teams')
      .respond(200, { "_meta": {"count": teams.length}, "teams": teams});
    parentScope = $rootScope.$new();
    element = angular.element('<admin-teams></admin-teams>');
    $compile(element)(parentScope);
    parentScope.$digest();
    $httpBackend.flush();
    controller = element.controller('adminTeams');
  }));

  it('should init scope with prop teams', function() {
    expect(controller.teams.length).toBe(2);
    expect(controller.teams[0].name).toBe('admin');
  });

  it('should disable deletion for current team', function() {
    var deleteButtons = element[0].querySelectorAll('.btn-danger');
    expect(angular.element(deleteButtons[0]).prop('disabled')).toBe(true);
    expect(angular.element(deleteButtons[1]).prop('disabled')).toBe(false);
  });
});
