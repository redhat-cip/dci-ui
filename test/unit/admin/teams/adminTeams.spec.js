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

describe('admin teams component', function() {
  var element;

  beforeEach(inject(function($rootScope, $compile) {
    element = $compile('<admin-teams teams="teams"></admin-teams>')($rootScope);
    $rootScope.teams = teams;
    $rootScope.$digest();
  }));

  it('should init scope with prop teams', function() {
    expect(element.scope().teams.length).toBe(2);
    expect(element.scope().teams[0].name).toBe('admin');
  });

  it('should disable deletion for current team', function() {
    var deleteButtons = element[0].querySelectorAll('.btn-danger');
    expect(angular.element(deleteButtons[0]).prop('disabled')).toBe(true);
    expect(angular.element(deleteButtons[1]).prop('disabled')).toBe(false);
  });
});
