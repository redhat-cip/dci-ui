import { AxiosPromise } from "axios";
import http from "services/http";
import { ITrends } from "types";

interface IGetTrends {
  topics: ITrends;
}

export function getTrends(): AxiosPromise<IGetTrends> {
  return http({
    method: "get",
    url: `/api/v1/trends/topics`,
  });
}
