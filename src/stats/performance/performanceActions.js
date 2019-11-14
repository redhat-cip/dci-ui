import http from "services/http";
import { showAPIError } from "alerts/alertsActions";

export function calcPerformance(base_job_id, job_id) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      data: { base_job_id, jobs:[job_id] },
      url: `${state.config.apiURL}/api/v1/performance`
    };
    return http(request).catch(error => {
      dispatch(showAPIError(error));
      return error;
    });
  };
}
