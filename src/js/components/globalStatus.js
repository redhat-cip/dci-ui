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

require("app").component("globalStatus", {
  templateUrl: "/partials/globalStatus.html",
  controller: GlobalStatusCtrl,
  bindings: {
    topics: "="
  }
});

function GlobalStatusCtrl() {
  var $ctrl = this;

  this.$onInit = function() {
    var topicsOrder = {
      OSP8: 1,
      OSP9: 2,
      OSP10: 3,
      OSP11: 4,
      OSP12: 5,
      "RDO-Newton": 6,
      "RDO-Ocata": 7,
      "RDO-Pike": 8
    };
    _.each($ctrl.topics, function(topic) {
      topic.success = 0;
      topic.failures = 0;
      topic.order = topicsOrder[topic.name] || 9;
      _.each(topic.jobs, function(job) {
        if (job.job_status === "success") {
          topic.success += 1;
        } else {
          topic.failures += 1;
        }
      });
      topic.percentageErrors = Math.round(
        100 * topic.failures / (topic.success + topic.failures)
      );
    });
    $ctrl.topics = _.sortBy($ctrl.topics, ["order"]);
  };

  $ctrl.getJobStatusClass = function(job_status) {
    var infoStatuses = ["new", "pre-run", "post-run"];
    var failureStatuses = ["failure", "product-failure", "deployment-failure"];
    if (infoStatuses.indexOf(job_status) !== -1) {
      return "text-info";
    } else if (failureStatuses.indexOf(job_status) !== -1) {
      return "text-danger";
    } else if (job_status === "success") {
      return "text-success";
    } else {
      return "text-warning";
    }
  };
}
