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

describe('admin remotecis component', function() {
  var component;

  beforeEach(inject(function($componentController) {
    component = $componentController('adminRemotecis', null, {
      remotecis: remotecis
    });
  }));

  it('should init scope with prop remotecis', function() {
    expect(component.remotecis.length).toBe(2);
    expect(component.remotecis[0].name).toBe('Admin Remote CI');
  });

  it('should change state when toggleLock is called', function() {
    component.remotecis[0] = {id: '1', name: 'rci', state: 'active'};
    $httpBackend
      .expectPUT('https://api.example.org/api/v1/remotecis/1', {name: 'rci', state: 'inactive'})
      .respond();
    component.toggleLockRemoteci(remotecis[0]);
    $httpBackend.flush();
    expect(component.remotecis[0].state).toBe('inactive');
  });
});
