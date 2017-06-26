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

require("app").component("topicsMetrics", {
  templateUrl: "/partials/metrics/topics.html",
  controller: ["$state", "$stateParams", "api", topicsMetricsCtrl]
});

function topicsMetricsCtrl($state, $stateParams, api) {
  var $ctrl = this;

  this.$onInit = function() {
    api.metrics.topics().then(function(topics) {
      $ctrl.topics = topics;
      $ctrl.selectedTopicName = $stateParams.selected;
      $ctrl.selectedRange = Number($stateParams.range || "3");
      $ctrl.updatePage($ctrl.selectedTopicName, $ctrl.selectedRange);
    });
  };

  function selectTopic(topics, selectedParam) {
    if (typeof selectedParam === "undefined") {
      var firstTopicName = Object.keys(topics)[0];
      return {
        name: firstTopicName,
        components: topics[firstTopicName]
      };
    } else {
      for (var topicName in topics) {
        if (selectedParam === topicName) {
          return {
            name: topicName,
            components: topics[topicName].components
          };
        }
      }
    }
  }

  $ctrl.updatePage = function(topicName, range) {
    $ctrl.selectedTopicName = topicName;
    $ctrl.selectedRange = range;
    $ctrl.filteredTopics = $ctrl.filterTopics(
      $ctrl.topics,
      $ctrl.selectedRange
    );
    $ctrl.selectedTopic = selectTopic(
      $ctrl.filteredTopics,
      $ctrl.selectedTopicName
    );
    $state.transitionTo(
      "statsMetrics",
      { selected: $ctrl.selectedTopicName, range: $ctrl.selectedRange },
      { notify: false }
    );
  };

  $ctrl.filterTopics = function(topics, range, now) {
    var filteredTopics = {};
    for (var topicName in topics) {
      filteredTopics[topicName] = {
        name: topicName,
        components: $ctrl.filterComponents(topics[topicName], range, now)
      };
    }
    return filteredTopics;
  };

  $ctrl.filterComponents = function(components, range, now) {
    if (range === -1) {
      return components;
    }

    now = typeof now === "undefined" ? new Date() : now;
    var monthAgo = new Date(now.getTime());
    monthAgo.setMonth(monthAgo.getMonth() - range);
    return components.filter(function(topic) {
      var topicDate = new Date(topic.date);
      return topicDate > monthAgo;
    });
  };
}
