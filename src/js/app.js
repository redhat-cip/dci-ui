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

'use strict';

var angular = require('angular');

var _ = require('lodash');

require('angular-animate');
require('angular-cookies');
require('angular-sanitize');
require('angular-ui-router');
require('ui-select');
require('angular-ui-bootstrap');
require('jsonformatter');

module.exports = angular.module('app', [
  'ngCookies', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.select',
  'jsonFormatter', 'dci.messages', 'ngSanitize'
])
.value('config', {})
.filter('limit', function() {
  return function(input, size, term) {
    if (size && input.length > size) {
      input = input.slice(0, size) + (term ? term : '');
    }
    return input;
  };
})
.run(['$http', '$q', 'config', function($http, $q, config) {
  var d = $q.defer();
  config.promise = d.promise;

  $http.get('/config.json').then(function(resp) {
    angular.extend(config, resp.data);
    d.resolve();
  }, function(err) {
    d.reject(err);
  });
}]);
