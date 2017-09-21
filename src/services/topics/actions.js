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

import http from "services/http";

export function order(topics) {
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
  topics.sort((t1, t2) => {
    const t1Order = topicsOrder[t1.name] || 9;
    const t2Order = topicsOrder[t2.name] || 9;
    return t1Order > t2Order;
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
  if (topic.success + topic.failures === 0) {
    topic.percentageErrors = 0;
  } else {
    topic.percentageErrors = Math.round(
      100 * topic.failures / (topic.success + topic.failures)
    );
  }
  return topic;
}

export function fetchJobs(topics, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    order(topics);
    const jobsPromises = [];
    topics.forEach(topic => {
      if (topic.component_types.length > 0) {
        const componentTypes = topic.component_types[0];
        const request = {
          method: "get",
          url: `${state.config
            .apiURL}/api/v1/topics/${topic.id}/type/${componentTypes}/status`,
          params
        };
        jobsPromises.push(http(request));
      }
    });

    return Promise.all(jobsPromises).then(values => {
      const newTopics = [];
      values.map((response, index) => {
        newTopics.push(
          enhanceTopic(
            Object.assign({}, topics[index], { jobs: response.data.jobs })
          )
        );
      });
      return newTopics;
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
