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

angular.module('app')
  .factory('moment', function() {
    moment.locale('en', {invalidDate: 'N/A'});
    moment.locale('fr', {invalidDate: 'N/A'});
    moment.defaultFormat = 'LLLL';

    var parser = _.partialRight(moment.utc, moment.ISO_8601, true);
    return _.assign(parser, {
      'moment': moment.utc
    });
  })
  .factory('appCache', ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('dci-app-cache');
  }])
;
