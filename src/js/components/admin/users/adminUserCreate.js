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
  .component('adminUserCreate', {
    templateUrl: '/partials/admin/users/userCreate.html',
    controller: ['$state', 'api', 'messages', adminUserCtrl],
    bindings: {
      teams: '=',
      roles: '=',
    }
  });

function adminUserCtrl($state, api, messages) {
  var $ctrl = this;

  this.$onInit = function() {
    var user_role_id = null;
    for (var i = 0; i < $ctrl.roles.length; i++) {
      var role = $ctrl.roles[i];
      if (role.name === 'User') {
        user_role_id = role.id
      }
    }
    $ctrl.user = {
      name: '',
      password: '',
      team_id: null,
      role_id: user_role_id
    };
  };

  $ctrl.create = function() {
    var userName = $ctrl.user.name;
    api.users.create($ctrl.user)
      .then(function() {
        messages.alert('user ' + userName + ' created', 'success');
        $state.reload();
      })
      .catch(function(err) {
        messages.alert('cannot create user ' + userName + ' (' + err.data.message + ')', 'danger');
      });
  };
}
