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

require('angular-bootstrap');

angular.module('dci.messages', ['ui.bootstrap'])
.service('messages', [
  '$timeout', '$log', '_', 'messagesConfig',
  function($timeout, $log, _, config) {
    var that = this;
    var log = {
      'danger': $log.error,
      'warning': $log.warn,
      'info': $log.info,
      'success': $log.log
    };
    this.alerts = [];

    this.alert = function(msg, type) {
      type = type || config.defaultType;
      var alert = {
        type: type,
        msgTitle: config.title[type],
        msg: msg
      };
      log[type](msg);
      $timeout(function() {
        _.pullAt(that.alerts, _.indexOf(that.alerts, alert));
      }, config.autoFadeDelay * 1000);
      this.alerts.push(alert);
      this.alerts.splice(config.max);
      return alert;
    };

    this.clearAllMessages = function() {
      this.alerts.length = 0;
    };
  }
])
.directive({
  dciMessages: ['messages', function(messages) {
    return {
      restrict: 'A',
      scope: {},
      templateUrl: '/partials/messages.html',
      link: function(scope) {
        scope.alerts = messages.alerts;

        scope.closeAlert = function(index) {
          scope.alerts.splice(index, 1);
        };
      }
    };
  }]
})
.constant('messagesConfig', {
  max: 5,
  autoFadeDelay: 5,
  defaultType: 'info',
  title: {
    danger: 'Error',
    warning: 'Warning',
    info: 'Info',
    success: 'Success',
  }
});
