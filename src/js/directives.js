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
.directive('dciJob', ['$injector', function($injector) {
  return {
    link: function(scope) {
      var _ = $injector.get('_');
      var api = $injector.get('api');
      var moment = $injector.get('moment');
      var status = $injector.get('status');
      var $state = $injector.get('$state');

      var job = scope.job;
      var start = moment(job.created_at);
      job.time_running = moment(job.updated_at).to(start, true);
      job.updated_at = moment(job.updated_at).from(moment.moment());

      job.processStatus = function(s) {
        job.status = s;
        job.statusClass = 'bs-callout-' + status[s].color;
        job.glyphicon = status[s].glyphicon;
      };

      job.processStatus(job.status);

      scope.recheck = function() {
        api.recheckJob(job.id).then(function(job) {
          $state.go('job', {id: job.id});
        });
      };

      scope.remove_job = function() {
        api.removeJob(job.id, job.etag).then(function(job) {
          $state.go('index');
        });
      };
    },
    templateUrl: '/partials/dci-job.html'
  };
}])
.directive('tabEdit', ['$log', '_', 'api', function($log, _, api) {
  return {
    templateUrl: '/partials/tabEdit.html',
    scope: {
      job: '=tabEdit'
    },
    link: function(scope) {
      var job = scope.job;
      scope.alerts = [];

      scope.reset = _.partial(_.assign, scope.form = {}, {
        comment: job.comment,
        status: false
      });
      scope.reset();

      scope.isEditableStatus = (
        _.indexOf(['success', 'failure'], job.status) !== -1
      );

      scope.submit = function() {
        var data = _.transform(scope.form, function(result, value, key) {
          if (_.includes([null, false], value)) { return; }
          if (key == 'status') {
            value = job.status == 'success' ? 'failure' : 'success';
          }
          result[key] = value;
        }, {});
        if (!_.isEmpty(data)) {
          api.updateJob(job.id, job.etag, data).then(
            function(resp) {
              job.processStatus(data.status || job.status);
              job.comment = data.comment || job.comment;
              job.etag = resp.headers('etag');
              scope.alerts.push({type: 'success', msg: 'Successfully updated'});
              scope.reset();
            },
            function(error) {
              var str = [
                error.status, error.statusText + ':', error.data.message
              ];
              scope.alerts.push({type: 'danger', msg: str.join(' ')});
              $log.error(error);
            }
          );
        }
      };
    }
  };
}]);
