import { AxiosPromise } from "axios";
import http from "services/http";
import { IJob, IGetTestsResults } from "types";

export function getResults(job: IJob): AxiosPromise<IGetTestsResults> {
  return http({
    method: "get",
    url: `/api/v1/jobs/${job.id}/results`,
  });
}
