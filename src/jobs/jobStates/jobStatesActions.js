import moment from "moment";
import http from "../../services/http";

export function addDuration(jobStates) {
  return jobStates
    .sort((js1, js2) => moment(js1.created_at).diff(moment(js2.created_at)))
    .map((jobState, i) => {
      const { filesWithDuration, jobStateDuration } = jobState.files
        .sort((f1, f2) => moment(f1.created_at).diff(moment(f2.created_at)))
        .reduce(
          (acc, file) => {
            const newCreatedAt = moment(file.created_at);
            const fileDuration = newCreatedAt.diff(acc.createdAt, "seconds");
            file.duration = fileDuration;
            acc.jobStateDuration += fileDuration;
            acc.filesWithDuration.push(file);
            acc.createdAt = newCreatedAt;
            return acc;
          },
          {
            createdAt: moment(jobState.created_at),
            filesWithDuration: [],
            jobStateDuration: 0
          }
        );
      return {
        ...jobState,
        duration: jobStateDuration,
        files: filesWithDuration
      };
    });
}

export function getJobStatesWithFiles(job) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/jobstates`,
      params: {
        embed: "files"
      }
    });
  };
}

export function getContent(file, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = Object.assign(
      {},
      {
        method: "get",
        url: `${state.config.apiURL}/api/v1/files/${file.id}/content`
      },
      params
    );
    return http(request);
  };
}
