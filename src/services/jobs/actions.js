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

export function fetchJobStates(job, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/jobstates`,
      params
    };
    return http(request).then(response => {
      return Object.assign({}, job, {
        jobstates: response.data.jobstates
      });
    });
  };
}

export function retrieveTests(job, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/results`,
      params
    };
    return http(request).then(response => {
      return Object.assign({}, job, { results: response.data.results });
    });
  };
}

export function createMeta(job, tag, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/tags`,
      data: tag,
      params
    };
    return http(request).then(response => {
      job.tags.push(response.data.tag);
      return Object.assign({}, job);
    });
  };
}

export function deleteMeta(job, tag, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/tags/${tag.id}`,
      params
    };

    return http(request).then(() => {
      job.tags = job.tags.filter(m => {
        return m.id !== tag.id;
      });
      return Object.assign({}, job);
    });
  };
}

export function getIssues(job, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/issues`,
      params
    };
    return http(request).then(response => {
      return Object.assign({}, job, { issues: response.data.issues });
    });
  };
}

export function createIssue(job, issue, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/issues`,
      data: issue,
      params
    };
    return http(request).then(response => {
      job.issues.push(response.data.issues);
      return Object.assign({}, job);
    });
  };
}

export function deleteIssue(job, issue, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/issues/${issue.id}`,
      params
    };

    return http(request).then(() => {
      job.issues = job.issues.filter(i => {
        return i.id !== issue.id;
      });
      return Object.assign({}, job);
    });
  };
}
