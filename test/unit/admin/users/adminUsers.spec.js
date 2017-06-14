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

describe("admin users", function() {
  describe("component", function() {
    var component;

    beforeEach(
      inject(function($componentController) {
        component = $componentController("adminUsers", null, {
          users: users
        });
      })
    );

    it("should get all users", function() {
      expect(component.users[0].name).toBe("admin");
      expect(component.users[0].role.name).toBe("Super Admin");
      expect(component.users.length).toBe(2);
    });
  });

  describe("template", function() {
    var template;

    beforeEach(
      inject(function($rootScope, $compile) {
        template = $compile('<admin-users users="users"></admin-users>')(
          $rootScope
        );
        $rootScope.users = users;
        $rootScope.$digest();
      })
    );

    it("should disable deletion for current user", function() {
      var deleteButtons = template[0].querySelectorAll(".btn-danger");
      expect(angular.element(deleteButtons[0]).prop("disabled")).toBe(true);
      expect(angular.element(deleteButtons[1]).prop("disabled")).toBe(false);
    });
  });
});
