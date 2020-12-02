import { showError } from "alerts/alertsActions";
import { createActions } from "api/apiActions";
import http from "services/http";
import { AppThunk } from "store";
import { IEnhancedJob } from "types";

export default createActions("job");

export function updateJobComment(
  job: IEnhancedJob
): AppThunk<Promise<IEnhancedJob>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "put",
      url: `${state.config.apiURL}/api/v1/jobs/${job.id}`,
      headers: { "If-Match": job.etag },
      data: {
        comment: job.comment,
      },
    })
      .then((response) => {
        return Promise.resolve({
          ...job,
          etag: response.data.job.etag,
        });
      })
      .catch((error) => {
        dispatch(showError("We are sorry we can't update this job"));
        return error;
      });
  };
}
