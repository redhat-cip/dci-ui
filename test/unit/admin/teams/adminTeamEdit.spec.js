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

describe('admin team edit component', function() {
  var element;

  beforeEach(inject(function($rootScope, $compile) {
    var parentScope = $rootScope.$new();
    element = angular.element('<admin-team-edit team="team"></admin-team-edit>');
    $compile(element)(parentScope);
    parentScope.team = adminTeam;
    parentScope.$digest();
  }));

  it('should init scope with prop team', function() {
    expect(element.scope().team.id).toBe('ac654db0-c6ff-40e8-82c7-9bc49989cb86');
    expect(element.scope().team.name).toBe('admin');
    expect(element.scope().team.notification).toBe(true);
  });
});
