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

require('app')
  .factory('messages', ['$log', function($log) {
    var messagesConfig = {
      max: 5,
      defaultType: 'info',
      title: {
        danger: 'Error',
        warning: 'Warning',
        info: 'Info',
        success: 'Success'
      },
      log: {
        danger: $log.error,
        warning: $log.warn,
        info: $log.info,
        success: $log.log
      }
    };

    var alerts = [];

    return {
      alerts: alerts,
      alert: function(msg, type) {
        type = type || messagesConfig.defaultType;
        var alert = {
          type: type,
          msgTitle: messagesConfig.title[type],
          msg: msg
        };
        messagesConfig.log[type](msg);
        alerts.push(alert);
        alerts.splice(messagesConfig.max);
        return alert;
      },
      generalError: function() {
        return {
          type: 'danger',
          msgTitle: messagesConfig.title['danger'],
          msg: 'An error occured, try again in a few minutes'
        }
      }
    }
  }
  ])
  .directive('dciMessages', ['messages', function(messages) {
    return {
      restrict: 'A',
      scope: {},
      templateUrl: '/partials/directives/messages.html',
      link: function(scope) {
        scope.alerts = messages.alerts;

        scope.closeAlert = function(index) {
          scope.alerts.splice(index, 1);
        };
      }
    };
  }]);
