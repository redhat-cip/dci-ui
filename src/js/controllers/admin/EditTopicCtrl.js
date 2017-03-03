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
  .controller('EditTopicCtrl', [
    '$scope', '$q', '$state', 'messages', 'api',
    function($scope, $q, messages, api, $state) {
      var obj = $scope.obj;
      var old_teams = _.map(obj.teams, function(elt) {
        return _.get(elt, 'id');
      });
      _.pullAllWith(obj.meta.teams, obj.teams, _.isEqual);

      $scope.add = function(i, team) {
        obj.teams.push(team);
        _.pullAt(obj.meta.teams, i);
      };

      $scope.remove = function(i, team) {
        obj.meta.teams.push(team);
        _.pullAt(obj.teams, i);
      };

      $scope.update = function() {
        if ($scope.objForm.$invalid) {
          return;
        }
        $q.all(_.map(old_teams, _.partial(api.topics.teams.remove, obj.id)))
          .then(function() {
            return $q.all(_.concat(
              api.topics.update(_.omit(obj, ['meta', 'teams'])),
              _.map(obj.teams, function(team) {
                return api.topics.teams.post(obj.id, team.id);
              })
            ));
          })
          .then(
            function() {
              $state.go(obj.meta.redirect);
              messages.alert(obj.meta.msg.success, 'success');
            },
            function(errs) {
              _.each(errs, function(err) {
                if (err.status === 409) {
                  messages.alert(obj.meta.msg.error);
                } else {
                  messages.alert(err.data.message, 'danger');
                }
              });
            }
          );
      };
    }
  ]);
