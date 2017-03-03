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

var assert = chai.assert;

describe('login controller', function() {
  var $httpBackend;
  var $rootScope;
  var createController;

  beforeEach(module('app'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/config.json')
      .respond({apiURL: 'http://localhost:5000', version: '7489734'});
    $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');
    createController = function() {
      return $controller('LoginCtrl', {'$scope': $rootScope});
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set err.status 401 when unauthorized', function() {
    createController();
    $httpBackend.when('GET', '/partials/login.html').respond();
    $httpBackend.flush();
    assert.equal(typeof $rootScope.err, 'undefined');
    $httpBackend.whenGET('http://localhost:5000/api/v1/users/test?embed=team')
      .respond(401);
    $rootScope.authenticate({username: 'test', password: 'password'});
    $httpBackend.flush();
    assert.equal($rootScope.err.status, 401);
  });
});
