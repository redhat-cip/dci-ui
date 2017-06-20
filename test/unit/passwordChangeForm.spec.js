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

describe("passwordChangeForm component", function() {
  var component;

  beforeEach(
    inject(function($componentController) {
      component = $componentController("passwordChangeForm", null, {
        user: admin
      });
      component.$onInit();
    })
  );

  it("should init component", function() {
    expect(component.password1).toBe("");
    expect(component.password2).toBe("");
  });

  it("should be able to change password", function(done) {
    var updatedUser = {
      name: admin.name,
      password: "password",
      role_id: admin.role_id,
      team_id: admin.team_id
    };
    $httpBackend
      .expectPUT(
        "https://api.example.org/api/v1/users/" + admin.id,
        updatedUser
      )
      .respond(updatedUser);
    component.password1 = "password";
    component.password2 = "password";
    component.onSuccess = function() {
      done();
    };
    component.changePassword();
    $httpBackend.flush();
  });

  it("should not be able to change password if passwords different", function(
    done
  ) {
    component.password1 = "password";
    component.password2 = "password 2 different";
    component.onError = function() {
      done();
    };
    component.changePassword();
  });
});
