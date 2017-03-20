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
  .component('adminTeams', {
    templateUrl: '/partials/admin/teams/teams.html',
    controller: ['$state', '$uibModal', 'api', 'user', 'messages', AdminTeamsCtrl],
  });

function AdminTeamsCtrl($state, $uibModal, api, user, messages) {
  var $ctrl = this;

  $ctrl.currentTeam = user.team;

  api.teams.list().then(function(data) {
    $ctrl.teams = data.teams;
  });

  $ctrl.editTeam = function(team) {
    $state.go('adminTeam', {id: team.id});
  };

  $ctrl.deleteTeam = function(team) {
    var teamName = team.name;
    var deleteTeamModal = $uibModal.open({
      component: 'confirmDestructiveAction',
      resolve: {
        data: function() {
          return {
            title: 'Delete team ' + teamName,
            body: 'Are you you want to delete team ' + teamName + '?',
            okButton: 'Yes delete ' + teamName,
            cancelButton: 'oups no!'
          }
        }
      }
    });
    deleteTeamModal.result.then(function() {
      api.teams.remove(team.id, team.etag).then(function() {
          messages.alert('team ' + teamName + ' has been removed', 'success');
          $state.reload();
        },
        function() {
          messages.alert('team ' + teamName + ' can\'t be removed', 'danger');
        });
    });
  }
}
