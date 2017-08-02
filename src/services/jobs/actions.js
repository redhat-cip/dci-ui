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

export function fetchJobStates(job, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/jobstates`,
      params
    };
    return http(request).then(response => {
      const newJob = Object.assign({}, job, {
        jobstates: response.data.jobstates
      });
      dispatch(api("job").actions.set(newJob));
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
      const newJob = Object.assign({}, job, { results: response.data.results });
      dispatch(api("job").actions.set(newJob));
    });
  };
}

export function createMeta(job, meta, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/metas`,
      data: meta,
      params
    };
    return http(request).then(response => {
      job.metas.push(response.data.meta);
      dispatch(api("job").actions.set(Object.assign({}, job)));
    });
  };
}

export function deleteMeta(job, meta, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/metas/${meta.id}`,
      params
    };

    return http(request).then(() => {
      job.metas = job.metas.filter(m => {
        return m.id !== meta.id;
      });
      dispatch(api("job").actions.set(job));
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
      const newJob = Object.assign({}, job, { issues: response.data.issues });
      dispatch(api("job").actions.set(newJob));
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
      dispatch(api("job").actions.set(Object.assign({}, job)));
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
      dispatch(api("job").actions.set(job));
    });
  };
}
