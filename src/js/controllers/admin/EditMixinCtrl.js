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
  .controller('EditMixinCtrl', [
    '$scope', '$state', 'obj', 'messages',
    function($scope, $state, obj, messages) {
      _.assign($scope, {obj: obj, objForm: {}});

      $scope.cancel = _.partial($state.go, obj.meta.redirect);

      $scope.showError = function(form, field) {
        return field.$invalid && (field.$dirty || form.$submitted);
      };

      $scope.update = function() {
        if ($scope.objForm.$invalid) {
          return;
        }
        $state.go(obj.meta.redirect);
        obj.meta.method($scope.obj).then(
          function() {
            messages.alert(obj.meta.msg.success, 'success');
          },
          function(err) {
            if (err.status === 409) {
              messages.alert(obj.meta.msg.error);
            } else {
              messages.alert(err.data.message, 'danger');
            }
          }
        );
      };
    }
  ]);
