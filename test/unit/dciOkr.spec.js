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

describe("dci okr component", function() {
  var component;

  beforeEach(
    inject(function($componentController) {
      component = $componentController("dciOkr", null, {
        topics: {
          OSP10: [
            {
              component: "RH7-RHOS-10.0 2016-11-23.3",
              date: "2016-11-24T09:16:36.997981",
              values: [48249, 50688]
            },
            {
              component: "RH7-RHOS-10.0 2016-11-29.1",
              date: "2016-11-29T08:16:18.835989",
              values: [215754]
            }
          ],
          OSP11: [
            {
              component: "RH7-RHOS-11.0 2016-12-09.2",
              date: "2016-12-12T02:10:46.320266",
              values: []
            },
            {
              component: "RH7-RHOS-11.0 2017-02-10.2",
              date: "2017-02-11T03:07:08.330633",
              values: [21394]
            }
          ]
        }
      });
      component.$onInit();
    })
  );

  it("should calc percentage tested", function() {
    expect(component.metrics["OSP10"].percentageTested).toBe(100);
    expect(component.metrics["OSP11"].percentageTested).toBe(50);
  });

  it("should calc percentage before 2 days okr", function() {
    expect(component.metrics["OSP10"].percentageBefore2days).toBe(50);
    expect(component.metrics["OSP11"].percentageBefore2days).toBe(100);
  });
});
