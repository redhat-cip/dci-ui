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

describe("topic metrics summary component", function() {
  var component;

  beforeEach(
    inject(function($componentController) {
      component = $componentController("topicMetricsSummary", null, {
        topic: {
          name: "OSP10",
          components: topicsMetrics["OSP10"]
        }
      });
      component.$onInit();
    })
  );

  it("should init component", function() {
    expect(component.topic.name).toBe("OSP10");
  });

  it("should calc percentage tested", function() {
    expect(component.percentageTested).toBe(100);
  });

  it("should calc percentage before 2 days okr", function() {
    expect(component.percentageBefore2days).toBe(50);
  });
});
