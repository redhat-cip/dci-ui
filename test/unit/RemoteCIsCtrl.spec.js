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

describe('RemoteCIsCtrl', function() {
  var $httpBackend;
  var $scope;
  var createController;

  beforeEach(module('app'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/config.json').respond({apiURL: 'http://localhost:5000', version: '7489734'});
    $httpBackend.when('GET', '/partials/login.html').respond();
    $httpBackend.flush();
    
    $scope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');
    createController = function() {
      return $controller('RemoteCIsCtrl', {
        '$scope': $scope,
        'remoteci': {id: 'af991b96-bfe0-4e00-bd87-5c98893c3238', token: 'af991b96'}
      });
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should refresh token', function() {
    createController();
    assert.equal($scope.remoteci.token, 'af991b96');
    $httpBackend
      .expectPUT('http://localhost:5000/api/v1/remotecis/af991b96-bfe0-4e00-bd87-5c98893c3238/api_secret', {})
      .respond({api_secret: '849ee0e2'});
    $scope.refreshToken();
    $httpBackend.flush();
    assert.equal($scope.remoteci.token, '849ee0e2');
  });
});

