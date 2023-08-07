import { showError } from "alerts/alertsActions";
import { createActions } from "api/apiActions";
import http from "services/http";
import { AppThunk } from "store";
import { IEnhancedJob, IJob } from "types";

export default createActions("job");

export function getJobSilently(jobId: string): Promise<IJob> {
  return http({
    method: "get",
    url: `/api/v1/jobs/${jobId}`,
  }).then((response) => response.data.job);
}

export function updateJobComment(
  job: IEnhancedJob,
): AppThunk<Promise<IEnhancedJob>> {
  return (dispatch) => {
    return http({
      method: "put",
      url: `/api/v1/jobs/${job.id}`,
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
