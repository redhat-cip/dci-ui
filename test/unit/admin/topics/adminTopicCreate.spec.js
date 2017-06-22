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

describe("admin topic create component", function() {
  var component;

  beforeEach(
    inject(function($componentController) {
      component = $componentController("adminTopicCreate");
    })
  );

  it("should init scope with empty topic", function() {
    expect(component.topic.name).toBe("");
    expect(component.topic.next_topic).toBe(null);
  });

  it("should create a topic", function() {
    component.topic.name = "OSP10";
    component.topic.next_topic = null;
    $httpBackend
      .expectPOST("https://api.example.org/api/v1/topics", { name: "OSP10" })
      .respond();
    component.create();
    $httpBackend.flush();
  });

  it("should create a topic with next_topic", function() {
    component.topic.name = "OSP11";
    component.topic.next_topic = "4b1e3cae-41e0-409c-8a35-0af056c69525";
    $httpBackend
      .expectPOST("https://api.example.org/api/v1/topics", {
        name: "OSP11",
        next_topic: "4b1e3cae-41e0-409c-8a35-0af056c69525"
      })
      .respond();
    component.create();
    $httpBackend.flush();
  });
});
