import http from "services/http";

export function getIssues(job) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/issues`,
    });
  };
}

export function createIssue(job, issue) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "post",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/issues`,
      data: issue,
    });
  };
}

export function deleteIssue(job, issue) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "delete",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/issues/${issue.id}`,
    });
  };
}
