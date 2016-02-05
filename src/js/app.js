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

var moment = require('moment');
var angular = require('angular');
var lodash = require('lodash');

require('angular-cookies');
require('angular-ui-router');
require('angular-bootstrap');
require('jsonformatter');

module.exports = angular.module('app', [
  'ngCookies', 'ui.router', 'ui.bootstrap', 'jsonFormatter'
])
.factory('moment', ['_', function(_) {
  moment.locale('en', {invalidDate: 'N/A'});
  moment.locale('fr', {invalidDate: 'N/A'});
  moment.defaultFormat = 'LLLL';

  var parser = _.partialRight(moment.utc, moment.ISO_8601, true);
  return _.assign(parser, {
    'moment': moment.utc
  });
}])
.factory('_', function() {
  return lodash;
})
.constant('status', {
  'failure': {
    'color': 'danger',
    'glyphicon': 'glyphicon-remove'
  },
  'success': {
    'color': 'success',
    'glyphicon': 'glyphicon-ok'
  },
  'running': {
    'color': 'warning',
    'glyphicon': 'glyphicon-play'
  },
  'new': {
    'color': 'primary',
    'glyphicon': 'glyphicon-record'
  },
  'pre-run': {
    'color': 'info',
    'glyphicon': 'glyphicon-record'
  },
  'post-run': {
    'color': 'info',
    'glyphicon': 'glyphicon-record'
  }
})
.factory('utils', ['$q', '_', function($q, _) {
  /*
   * synchronize calls against a promises stack, callback is
   * called in order of the promises stack, if it returns
   * false, then the synchronization stops.
   */
  function synchronize(promises, cb, index) {
    var d = $q.defer();
    var p = promises.shift();
    if (!p) {
      d.resolve();
    } else {
      p.then(function(res) {
        if (cb(res, index) === false) {
          d.resolve();
        } else {
          synchronize(promises, cb, index + 1).then(d.resolve);
        }
      });
    }
    return d.promise;
  }

  return {
    lo: _,
    synchronize: _.partialRight(synchronize, 0)
  };
}])
.value('config', {})
.run(['$http', '$q', 'config', function($http, $q, config) {
  var d = $q.defer();
  config.promise = d.promise;

  $http.get('/config.json').then(function(resp) {
    angular.extend(config, resp.data);
    d.resolve();
  }, function(err) {
    d.reject(err);
  });
}]);
