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
      component = $componentController("settingsChangeForm", null, {
        user: admin
      });
      component.$onInit();
    })
  );

  it("should init component", function() {
    expect(component.current_password).toBe("");
  });

  it("should be able to update settings", function(done) {
    var updatedUser = {
      current_password: "current_password",
      fullname: "User Test",
      email: "test@example.org"
    };
    $httpBackend
      .expectPUT("https://api.example.org/api/v1/users/me", updatedUser)
      .respond(updatedUser);
    component.current_password = "current_password";
    component.user.fullname = "User Test";
    component.user.email = "test@example.org";
    component.onSuccess = function() {
      done();
    };
    component.changeSettings();
    $httpBackend.flush();
  });
});
