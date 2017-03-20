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

describe('admin topic edit component', function() {
  var element;

  beforeEach(inject(function($rootScope, $compile) {
    var parentScope = $rootScope.$new();
    element = angular.element('<admin-topic-edit topic="topic" teams="teams" topic-teams="topicTeams"></admin-topic-edit>');
    $compile(element)(parentScope);
    parentScope.topic = osp10;
    parentScope.teams = teams;
    parentScope.topicTeams = osp10Teams;
    parentScope.$digest();
  }));

  it('should init scope with prop topic', function() {
    expect(element.scope().topic.id).toBe('d95c065a-fbc9-984c-8e9d-454d1a9171a7');
    expect(element.scope().topic.name).toBe('OSP10');
    expect(element.scope().topic.state).toBe('active');
  });

  it('should init availableTeams with difference between teams and topicTeams', function() {
    var controller = element.controller('adminTopicEdit');
    expect(controller.availableTeams.length).toBe(teams.length-osp10Teams.length);
    expect(controller.availableTeams[0]).toBe(teams[1]);
  });

  it('should associate team to topic teams', function() {
    var controller = element.controller('adminTopicEdit');
    controller.availableTeams = [{id:1}];
    controller.topicTeams = [{id:2}];
    $httpBackend
      .expectPOST('https://api.example.org/api/v1/topics/d95c065a-fbc9-984c-8e9d-454d1a9171a7/teams', {team_id: 1})
      .respond();
    controller.associateTeamToTopic({id:1});
    $httpBackend.flush();
    expect(controller.availableTeams.length).toBe(0);
    expect(controller.topicTeams.length).toBe(2);
  });

  it('should remove team from topic teams', function() {
    var controller = element.controller('adminTopicEdit');
    controller.availableTeams = [{id:1}];
    controller.topicTeams = [{id:2}];
    $httpBackend
      .expectDELETE('https://api.example.org/api/v1/topics/d95c065a-fbc9-984c-8e9d-454d1a9171a7/teams/2')
      .respond();
    controller.removeTeamFromTopic({id:2});
    $httpBackend.flush();
    expect(controller.topicTeams.length).toBe(0);
    expect(controller.availableTeams.length).toBe(2);
  });
});
