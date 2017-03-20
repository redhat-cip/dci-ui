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
  .component('adminMenu', {
    templateUrl: '/partials/admin/menu.html',
    controller: ['$state', adminMenuCtrl],
    bindings: {
      endpoint: '@'
    }
  });

function adminMenuCtrl($state) {
  var $ctrl = this;

  $ctrl.tabs = [
    {
      title: "Users",
      endpoint: "users",
      state: "adminUsers"
    },
    {
      title: "Teams",
      endpoint: "teams",
      state: "adminTeams"
    },
    {
      title: "Topics",
      endpoint: "topics",
      state: "adminTopics"
    },
    {
      title: "RemoteCIs",
      endpoint: "remotecis",
      state: "adminRemotecis"
    },
    {
      title: "Audits",
      endpoint: "audits",
      state: "adminAudits"
    }
  ];

  $ctrl.activeTabIndex = 0;

  $ctrl.tabs.forEach(function(tab, index) {
    if (tab.endpoint === $ctrl.endpoint) {
      $ctrl.activeTabIndex = index;
    }
  });

  $ctrl.open = function(tab) {
    $state.go(tab.state);
  };
}
