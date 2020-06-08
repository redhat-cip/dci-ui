import moment from "moment";
import http from "services/http";

export function addDuration(jobStates) {
  const { newJobStates } = jobStates
    .sort((js1, js2) => moment(js1.created_at).diff(moment(js2.created_at)))
    .reduce(
      (acc, jobState) => {
        const { newFiles, duration } = jobState.files
          .sort((f1, f2) => moment(f1.created_at).diff(moment(f2.created_at)))
          .reduce(
            (fileAcc, file) => {
              const duration = acc.currentDate
                ? moment(file.created_at).diff(acc.currentDate, "seconds")
                : 0;
              file.duration = duration;
              fileAcc.newFiles.push(file);
              fileAcc.duration += duration;
              acc.currentDate = moment(file.updated_at);
              return fileAcc;
            },
            { newFiles: [], duration: 0 }
          );
        jobState.files = newFiles;
        jobState.duration = duration;
        acc.newJobStates.push(jobState);
        return acc;
      },
      { newJobStates: [], currentDate: null }
    );
  return newJobStates;
}

export function getJobStatesWithFiles(job) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}/jobstates`,
      params: {
        embed: "files",
      },
    });
  };
}

export function getContent(file, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/files/${file.id}/content`,
      params,
    });
  };
}
