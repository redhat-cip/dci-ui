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
  .component('adminUser', {
    templateUrl: '/partials/admin/user.html',
    controller: ['$state', 'api', adminUserCtrl]
  });

function adminUserCtrl($state, api) {
  var $ctrl = this;

  var user = {id: $state.params.id};
  api.users.get2(user).then(function(data) {
    $ctrl.user = data.user;
  });

  api.teams.list().then(function(data) {
    $ctrl.teams = data.teams;
  });

  $ctrl.toggleRole = function() {
    if ($ctrl.user.role === 'admin') {
      $ctrl.user.role = 'user';
    } else {
      $ctrl.user.role = 'admin';
    }
  };
}
