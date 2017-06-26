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

describe("topics metrics component", function() {
  describe("without stateParams", function() {
    var component;

    beforeEach(
      inject(function($componentController) {
        component = $componentController("topicsMetrics", null, {});
        $httpBackend
          .expectGET("https://api.example.org/api/v1/metrics/topics/")
          .respond({ topics: topicsMetrics });
        component.$onInit();
        $httpBackend.flush();
      })
    );

    it("should init component with first topic and default range", function() {
      expect(component.topics).toEqual(topicsMetrics);
      expect(component.selectedTopic.name).toEqual("OSP10");
      expect(component.selectedTopic.components.length).toEqual(0);
      expect(component.selectedRange).toEqual(3);
    });
  });
  describe("with stateParams", function() {
    var component;

    beforeEach(
      inject(function($componentController) {
        component = $componentController(
          "topicsMetrics",
          {
            $stateParams: {
              range: "-1",
              selected: "OSP11"
            }
          },
          {}
        );
        $httpBackend
          .expectGET("https://api.example.org/api/v1/metrics/topics/")
          .respond({ topics: topicsMetrics });
        component.$onInit();
        $httpBackend.flush();
      })
    );

    it("should set selectedTopic", function() {
      expect(component.selectedTopic.name).toEqual("OSP11");
      expect(component.selectedTopic.components).toEqual(
        topicsMetrics["OSP11"]
      );
    });

    it("should convert range into integer", function() {
      expect(component.selectedRange).toEqual(-1);
    });

    it("should filter component since 3 months", function() {
      var components = [
        {
          component: "RH7-RHOS-10.0 2016-11-10.1",
          date: "2016-11-10T00:00:00.000Z",
          values: []
        },
        {
          component: "RH7-RHOS-10.0 2016-11-20.1",
          date: "2016-11-20T00:00:00.000Z",
          values: []
        }
      ];
      var since3Months = 3;
      var now = new Date(2017, 1, 15);

      var filteredComponents = component.filterComponents(
        components,
        since3Months,
        now
      );

      expect(filteredComponents.length).toBe(1);
      expect(filteredComponents[0].component).toBe(
        "RH7-RHOS-10.0 2016-11-20.1"
      );
    });

    it("should return all components if range equals -1", function() {
      var filteredComponents = component.filterComponents([{}, {}], -1);
      expect(filteredComponents.length).toBe(2);
    });
  });
});
