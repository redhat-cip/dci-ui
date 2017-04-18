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
  var component;

  beforeEach(inject(function($componentController) {
    component = $componentController('adminTopicEdit', null, {
      topic: osp10,
      teams: teams,
      topicTeams: osp10Teams
    });
    component.$onInit();
  }));

  it('should init scope with prop topic', function() {
    expect(component.topic.id).toBe('d95c065a-fbc9-984c-8e9d-454d1a9171a7');
    expect(component.topic.name).toBe('OSP10');
    expect(component.topic.state).toBe('active');
  });

  it('should init availableTeams with difference between teams and topicTeams', function() {
    expect(component.availableTeams.length).toBe(teams.length - osp10Teams.length);
    expect(component.availableTeams[0]).toBe(teams[1]);
  });

  it('should associate team to topic teams', function() {
    component.availableTeams = [{id: 1}];
    component.topicTeams = [{id: 2}];
    $httpBackend
      .expectPOST('https://api.example.org/api/v1/topics/d95c065a-fbc9-984c-8e9d-454d1a9171a7/teams', {team_id: 1})
      .respond();
    component.associateTeamToTopic({id: 1});
    $httpBackend.flush();
    expect(component.availableTeams.length).toBe(0);
    expect(component.topicTeams.length).toBe(2);
  });

  it('should remove team from topic teams', function() {
    component.availableTeams = [{id: 1}];
    component.topicTeams = [{id: 2}];
    $httpBackend
      .expectDELETE('https://api.example.org/api/v1/topics/d95c065a-fbc9-984c-8e9d-454d1a9171a7/teams/2')
      .respond();
    component.removeTeamFromTopic({id: 2});
    $httpBackend.flush();
    expect(component.topicTeams.length).toBe(0);
    expect(component.availableTeams.length).toBe(2);
  });
});
