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

describe('admin users', function() {
  describe('component', function() {
    var component;

    beforeEach(inject(function($componentController) {
      component = $componentController('adminUsers', null, {
        users: users,
        teams: teams,
        roles: roles
      });
    }));

    it('should get all users', function() {
      expect(component.users[0].name).toBe('admin');
      expect(component.users.length).toBe(2);
      expect(component.teams.length).toBe(2);
      expect(component.roles.length).toBe(3);
    });

    it('should get role name', function() {
      expect(component.getRoleName(users[0].role_id)).toBe('Super Admin');
      expect(component.getRoleName(users[1].role_id)).toBe('User');
    });
  });

  describe('template', function() {
    var template;

    beforeEach(inject(function($rootScope, $compile) {
      template = $compile('<admin-users users="users" teams="teams" roles="roles"></admin-users>')($rootScope);
      $rootScope.users = users;
      $rootScope.teams = teams;
      $rootScope.roles = roles;
      $rootScope.$digest();
    }));

    it('should disable deletion for current user', function() {
      var deleteButtons = template[0].querySelectorAll('.btn-danger');
      expect(angular.element(deleteButtons[0]).prop('disabled')).toBe(true);
      expect(angular.element(deleteButtons[1]).prop('disabled')).toBe(false);
    });
  });
});
