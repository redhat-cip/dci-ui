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

describe('admin user create component', function() {
  var element;

  beforeEach(inject(function($rootScope, $compile) {
    var parentScope = $rootScope.$new();
    element = angular.element('<admin-user-create teams="teams"></admin-user-create>');
    $compile(element)(parentScope);
    parentScope.teams = teams;
    parentScope.$digest();
  }));

  it('should init scope with prop teams', function() {
    expect(element.scope().teams.length).toBe(2);
  });

  it('should init scope with empty user', function() {
    var controller = element.controller('adminUserCreate');
    expect(controller.user.name).toBe('');
    expect(controller.user.password).toBe('');
    expect(controller.user.team_id).toBe(null);
    expect(controller.user.role).toBe('user');
  });
});
