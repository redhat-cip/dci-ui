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

"use strict";
require("app").component("topicMetricsSummary", {
  templateUrl: "/partials/metrics/topicSummary.html",
  controller: topicMetricsSummaryCtrl,
  bindings: {
    topic: "="
  }
});

function topicMetricsSummaryCtrl() {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.percentageTested = percentageTested($ctrl.topic.components);
    $ctrl.percentageBefore2days = percentageBefore2days($ctrl.topic.components);
  };

  function percentageBefore2days(components) {
    var count = 0;
    var numberBefore2Day = 0;
    components
      .filter(function(component) {
        return component.values.length > 0;
      })
      .forEach(function(component) {
        count += 1;
        var twoDays = 2 * 24 * 60 * 60;
        var firstRunDuration = component.values[0];
        if (firstRunDuration < twoDays) {
          numberBefore2Day += 1;
        }
      });
    return Math.round(numberBefore2Day * 100 / count);
  }

  function percentageTested(components) {
    var count = 0;
    var tested = 0;
    components.forEach(function(component) {
      count += 1;
      if (component.values.length > 0) {
        tested += 1;
      }
    });
    return Math.round(tested * 100 / count);
  }
}
