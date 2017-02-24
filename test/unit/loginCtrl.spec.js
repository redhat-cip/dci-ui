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
