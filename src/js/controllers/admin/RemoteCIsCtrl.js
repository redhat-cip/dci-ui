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
  .controller('RemoteCIsCtrl', [
    '$scope', '$state', 'remoteci', 'api', 'messages',
    function($scope, $state, remoteci, api, messages) {
      remoteci.data = angular.toJson(remoteci.data, true);
      $scope.remoteci = remoteci;

      $scope.remoteciForm = {};

      $scope.cancel = _.partial($state.go, 'administrate.remotecis');

      $scope.showError = function(form, field) {
        return field.$invalid && (field.$dirty || form.$submitted);
      };

      $scope.update = function() {
        if ($scope.remoteciForm.$invalid) {
          return;
        }
        const newRemoteCi = _.assign({}, $scope.remoteci, {'data': angular.fromJson($scope.remoteci.data)});
        api['remotecis'].update(newRemoteCi)
          .then(function() {
            messages.alert('Team has been updated', 'success');
            $state.go('administrate.remotecis');
          })
          .catch(function(err) {
            messages.alert(
              err.data && err.data.message ||
              'Something went wrong', 'danger'
            );
          });
      };

      $scope.refreshToken = function(){
        api['remotecis'].refreshToken($scope.remoteci)
          .then(function(token) {
            $scope.remoteci.token = token;
            messages.alert('Api token has been updated', 'success');
          })
          .catch(function(err) {
            messages.alert(
              err.data && err.data.message ||
              'Something went wrong', 'danger'
            );
          });
      }
    }
  ]);
