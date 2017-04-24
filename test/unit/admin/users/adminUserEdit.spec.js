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

describe('admin user edit component', function() {
  var component;

  beforeEach(inject(function($componentController) {
    component = $componentController('adminUserEdit', null, {
      user: admin,
      teams: teams
    });
  }));

  it('should init scope with prop user', function() {
    expect(component.user.id).toBe('4bdddeb3-ce9f-4590-b715-e1b21ed257d3');
    expect(component.user.name).toBe('admin');
  });

  it('should init scope with prop teams', function() {
    expect(component.teams.length).toBe(2);
  });

  it('should update user', function() {
    component.user = {id: 1, name: 'foo', team_id: 1, role_id: 1, password: ''};
    $httpBackend
      .expectPUT('https://api.example.org/api/v1/users/1', {name: 'foo', team_id: 1, role_id: 1, password: ''})
      .respond();
    $httpBackend.whenGET('https://api.example.org/api/v1/users?embed=team').respond();
    $httpBackend.whenGET('https://api.example.org/api/v1/teams').respond();
    component.update();
    $httpBackend.flush();
  });
});
