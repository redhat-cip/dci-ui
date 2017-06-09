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

describe("admin user form component", function() {
  var component;

  beforeEach(
    inject(function($componentController) {
      component = $componentController("adminUserForm", null, {
        user: {
          name: "",
          fullname: "",
          email: "",
          password: "",
          team_id: null
        }
      });
      component.$onInit();
      $httpBackend
        .expectGET("https://api.example.org/api/v1/teams")
        .respond({ teams: teams });
      $httpBackend
        .expectGET("https://api.example.org/api/v1/roles")
        .respond({ roles: roles });
      $httpBackend.flush();
    })
  );

  it("should init scope teams and roles", function() {
    expect(component.teams.length).toBe(2);
    expect(component.roles.length).toBe(3);
  });

  it("should init undefined user role_id with id of role USER", function() {
    var idOfRoleUSER = rolesByName["USER"].id;
    expect(component.user.role_id).toBe(idOfRoleUSER);
  });
});
