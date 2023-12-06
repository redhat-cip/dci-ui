import http from "services/http";
import { IJob, IGetJobStates } from "types";
import { AxiosPromise } from "axios";

export function getJobStatesWithFiles(job: IJob): AxiosPromise<IGetJobStates> {
  return http({
    method: "get",
    url: `/api/v1/jobs/${job.id}/jobstates`,
  });
}
