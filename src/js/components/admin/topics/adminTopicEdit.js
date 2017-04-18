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
  .component('adminTopicEdit', {
    templateUrl: '/partials/admin/topics/topicEdit.html',
    controller: ['$state', 'api', 'messages', adminTopicCtrl],
    bindings: {
      topic: '=',
      topicTeams: '=',
      teams: '='
    }
  });

function adminTopicCtrl($state, api, messages) {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.availableTeams = _.differenceWith($ctrl.teams, $ctrl.topicTeams, _.isEqual);
  };

  $ctrl.associateTeamToTopic = function(team) {
    _.remove($ctrl.availableTeams, {id: team.id});
    $ctrl.topicTeams.push(team);
    api.topics.teams.post($ctrl.topic.id, team.id);
  };

  $ctrl.removeTeamFromTopic = function(team) {
    _.remove($ctrl.topicTeams, {id: team.id});
    $ctrl.availableTeams.push(team);
    api.topics.teams.remove($ctrl.topic.id, team.id);
  };

  $ctrl.update = function() {
    var topicName = $ctrl.topic.name;
    api.topics.update($ctrl.topic)
      .then(function() {
        messages.alert('topic ' + topicName + ' updated', 'success');
        $state.go('adminTopics');
      })
      .catch(function(err) {
        messages.alert('cannot update topic ' + topicName + ' (' + err.data.message + ')', 'danger');
      });
  };
}
