import moment from "moment";
import http from "../../services/http";

export function addDuration(jobStates, initial_duration = null) {
  const lastItemIndex = jobStates.length - 1;
  if (lastItemIndex < 0) return jobStates;
  if (lastItemIndex === 0 && initial_duration === null)
    return [
      {
        ...jobStates[0],
        pre_duration: null,
        next_duration: null
      }
    ];
  return jobStates
    .sort((js1, js2) => moment(js1.created_at).diff(moment(js2.created_at)))
    .map((jobState, i) => {
      const d = moment(jobState.created_at);
      const pre_d =
        i === 0
          ? initial_duration === null
            ? null
            : moment(initial_duration)
          : moment(jobStates[i - 1].created_at);
      const next_d =
        i === lastItemIndex ? null : moment(jobStates[i + 1].created_at);
      return {
        ...jobState,
        pre_duration: pre_d ? d.diff(pre_d, "seconds") : null,
        next_duration: next_d ? next_d.diff(d, "seconds") : null
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
