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

describe('admin users component', function() {
  var $httpBackend;
  var parentScope;
  var element;
  var controller;

  beforeEach(module('app'));

  beforeEach(module('templates'));

  beforeEach(module(function($provide) {
    $provide.value('user', {id:'4bdddeb3-ce9f-4590-b715-e1b21ed257d3'});
  }));

  beforeEach(inject(function($injector, $rootScope, $compile) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/config.json').respond();
    $httpBackend.when('GET', '/api/v1/users/?embed=team')
      .respond(200, {
        "_meta": {"count": 2},
        "users": [{
          "created_at": "2017-02-20T17:32:48.744939",
          "updated_at": "2017-02-20T17:32:48.828440",
          "etag": "59b891ba3e97763da40b797c1638ee7f",
          "id": "4bdddeb3-ce9f-4590-b715-e1b21ed257d3",
          "name": "admin",
          "role": "admin",
          "state": "active",
          "team": {
            "country": null,
            "created_at": "2017-02-20T17:32:48.200667",
            "email": "admin@example.org",
            "etag": "da40b797c1638ee7f59b891ba3e97763",
            "id": "ac654db0-c6ff-40e8-82c7-9bc49989cb86",
            "name": "admins",
            "notification": null,
            "state": "active",
            "updated_at": "2017-02-20T17:32:48.081616"
          }
        }, {
          "created_at": "2017-02-22T12:32:48.469453",
          "updated_at": "2017-02-22T12:32:48.469465",
          "etag": "7f59b891ba3e97763da40b797c1638ee",
          "id": "ac654db0-ce9f-4c3c-b715-c4bdddeb7e61",
          "name": "user",
          "role": "user",
          "state": "active",
          "team": {
            "country": null,
            "created_at": "2017-02-22T12:32:48.744939",
            "email": "user@example.org",
            "etag": "a3e97763da40b797c1638ee7f59b891b",
            "id": "4db0ac65-3c4c-4d09-a8fa-257d3e1b21ed",
            "name": "users",
            "notification": null,
            "state": "active",
            "updated_at": "2017-02-22T12:32:48.744946"
          }
        }]
      });
    parentScope = $rootScope.$new();
    element = angular.element('<admin-users></admin-users>');
    $compile(element)(parentScope);
    parentScope.$digest();
    $httpBackend.flush();
    controller = element.controller('adminUsers');
    parentScope.$digest();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get all users', function() {
    expect(controller.users.length).toBe(2);
    expect(controller.users[0].name).toBe('admin');
  });

  it('should disable deletion for current user', function() {
    var deleteButtons = element[0].querySelectorAll('.btn-danger');
    expect(angular.element(deleteButtons[0]).prop('disabled')).toBe(true);
    expect(angular.element(deleteButtons[1]).prop('disabled')).toBe(false);
  });
});
