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

describe('admin audits component', function() {
  var element;

  beforeEach(inject(function($rootScope, $compile) {
    var parentScope = $rootScope.$new();
    element = angular.element('<admin-audits audits="audits"></admin-audits>');
    $compile(element)(parentScope);
    parentScope.audits = audits;
    parentScope.$digest();
  }));

  it('should get all audits', function() {
    expect(element.scope().audits.length).toBe(2);
    expect(element.scope().audits[0].action).toBe('create_teams');
    expect(element.scope().audits[0].team_id).toBe('73de0e1f-6904-a849-82c7-e1b21ed257d3');
    expect(element.scope().audits[0].user_id).toBe('5e3688e5-98ac-4590--9bc49989cb86');
  });
});
