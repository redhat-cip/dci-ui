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

describe('admin user create component', function() {
  var $httpBackend;
  var parentScope;
  var element;

  beforeEach(module('app'));

  beforeEach(module('templates'));

  beforeEach(inject(function($injector, $rootScope, $compile) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/config.json').respond();
    $httpBackend.flush();
    parentScope = $rootScope.$new();
    element = angular.element('<admin-user-create teams="teams"></admin-user-create>');
    $compile(element)(parentScope);
    parentScope.teams = [{
      "country": null,
      "created_at": "2017-02-20T17:32:48.200667",
      "email": "admin@example.org",
      "etag": "da40b797c1638ee7f59b891ba3e97763",
      "id": "ac654db0-c6ff-40e8-82c7-9bc49989cb86",
      "name": "admins",
      "notification": null,
      "state": "active",
      "updated_at": "2017-02-20T17:32:48.081616"
    }, {
      "country": null,
      "created_at": "2017-02-22T12:32:48.744939",
      "email": "user@example.org",
      "etag": "a3e97763da40b797c1638ee7f59b891b",
      "id": "4db0ac65-3c4c-4d09-a8fa-257d3e1b21ed",
      "name": "users",
      "notification": null,
      "state": "active",
      "updated_at": "2017-02-22T12:32:48.744946"
    }];
    parentScope.$digest();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should init scope with prop teams', function() {
    expect(element.scope().teams.length).toBe(2);
  });

  it('should init scope with empty user', function() {
    var controller = element.controller('adminUserCreate');
    expect(controller.user.name).toBe('');
    expect(controller.user.password).toBe('');
    expect(controller.user.team_id).toBe(null);
    expect(controller.user.role).toBe('user');
  });
});
