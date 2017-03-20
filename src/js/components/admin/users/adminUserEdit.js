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
  .component('adminUserEdit', {
    templateUrl: '/partials/admin/users/userEdit.html',
    controller: ['$state', 'api', 'messages', adminUserCtrl],
    bindings: {
      user: '=',
      teams: '='
    }
  });

function adminUserCtrl($state, api, messages) {
  var $ctrl = this;

  $ctrl.update = function() {
    var userName = $ctrl.user.name;
    api.users.update($ctrl.user)
      .then(function() {
        messages.alert('user ' + userName + ' updated', 'success');
        $state.go('adminUsers');
      })
      .catch(function(err) {
        messages.alert('cannot update user ' + userName + ' (' + err.data.message + ')', 'danger');
      });
  };

  $ctrl.toggleRole = function() {
    if ($ctrl.user.role === 'admin') {
      $ctrl.user.role = 'user';
    } else {
      $ctrl.user.role = 'admin';
    }
  };
}
