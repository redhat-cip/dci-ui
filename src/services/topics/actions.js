// Copyright 2017 Red Hat, Inc.
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

import api from "services/api";
import http from "services/http";

const topicsOrder = {
  OSP12: 1,
  OSP11: 2,
  OSP10: 3,
  OSP9: 4,
  OSP8: 5,
  "RDO-Pike": 6,
  "RDO-Ocata": 7,
  "RDO-Newton": 8
};

export function order(topics, dispatch) {
  topics.forEach(topic => {
    topic.order = topicsOrder[topic.name] || 9;
    dispatch(api("topic").actions.update(Object.assign({}, topic)));
  });
}

function enhanceTopic(topic) {
  topic.success = 0;
  topic.failures = 0;
  topic.jobs.forEach(job => {
    if (job.job_status === "success") {
      topic.success += 1;
    } else {
      topic.failures += 1;
    }
  });
  topic.percentageErrors = Math.round(
    100 * topic.failures / (topic.success + topic.failures)
  );
  return topic;
}

export function fetchJobs(topics, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    order(topics, dispatch);
    topics.forEach(topic => {
      if (topic.component_types.length > 0) {
        const componentTypes = topic.component_types[0];
        const statusRequest = {
          method: "get",
          url: `${state.config
            .apiURL}/api/v1/topics/${topic.id}/type/${componentTypes}/status`,
          params
        };
        return http(statusRequest).then(response => {
          const jobs = response.data.jobs;
          dispatch(
            api("topic").actions.update(
              enhanceTopic(Object.assign({}, topic, { jobs }))
            )
          );
        });
      }
    });
  };
}

function getComponentsFromReponse(response, topic) {
  return response.data.components.map(function(component) {
    component.topic = topic;
    return component;
  });
}

export function fetchComponents(topics, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    order(topics, dispatch);

    const componentsPromises = [];
    topics.forEach(topic => {
      const request = {
        method: "get",
        url: `${state.config.apiURL}/api/v1/topics/${topic.id}/components`,
        params
      };
      componentsPromises.push(http(request));
    });

    return Promise.all(componentsPromises).then(values => {
      const components = [];
      values.map((response, index) => {
        getComponentsFromReponse(response, topics[index]).forEach(component => {
          components.push(component);
        });
      });
      return components;
    });
  };
}

export function associateTeamToTopic(topic, team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}/teams`,
      data: { team_id: team.id }
    };
    return http(request);
  };
}

export function removeTeamFromTopic(topic, team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}/teams/${team.id}`,
      headers: { "If-Match": team.etag }
    };
    return http(request);
  };
}
