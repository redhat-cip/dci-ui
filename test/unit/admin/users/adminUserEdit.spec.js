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
  var parentScope;
  var element;

  beforeEach(inject(function($rootScope, $compile) {
    parentScope = $rootScope.$new();
    element = angular.element('<admin-user-edit user="user" teams="teams"></admin-user-edit>');
    $compile(element)(parentScope);
    parentScope.user = admin;
    parentScope.teams = teams;
    parentScope.$digest();
  }));

  it('should init scope with prop user', function() {
    expect(element.scope().user.id).toBe('4bdddeb3-ce9f-4590-b715-e1b21ed257d3');
    expect(element.scope().user.name).toBe('admin');
  });

  it('should init scope with prop teams', function() {
    expect(element.scope().teams.length).toBe(2);
  });
});
