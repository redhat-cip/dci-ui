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

require("app").component("adminTopics", {
  templateUrl: "/partials/admin/topics/topics.html",
  controller: ["$state", "$uibModal", "api", "messages", AdminTopicsCtrl],
  bindings: {
    topics: "="
  }
});

function AdminTopicsCtrl($state, $uibModal, api, messages) {
  var $ctrl = this;

  $ctrl.editTopic = function(topic) {
    $state.go("adminTopic", { id: topic.id });
  };

  $ctrl.deleteTopic = function(topic) {
    var topicName = topic.name;
    var deleteTopicModal = $uibModal.open({
      component: "confirmDestructiveAction",
      resolve: {
        data: function() {
          return {
            title: "Delete topic " + topicName,
            body: "Are you you want to delete topic " + topicName + "?",
            okButton: "Yes delete " + topicName,
            cancelButton: "oups no!"
          };
        }
      }
    });
    deleteTopicModal.result.then(function() {
      api.topics.remove(topic.id, topic.etag).then(
        function() {
          messages.alert("topic " + topicName + " has been removed", "success");
          $state.reload();
        },
        function() {
          messages.alert("topic " + topicName + " can't be removed", "danger");
        }
      );
    });
  };
}
