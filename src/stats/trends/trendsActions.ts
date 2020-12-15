import { AxiosPromise } from "axios";
import http from "services/http";
import { AppThunk } from "store";
import { ITrends } from "types";

interface IGetTrends {
  topics: ITrends;
}

// todo remove app thunk
export function getTrends(): AppThunk<AxiosPromise<IGetTrends>> {
  return () => {
    return http({
      method: "get",
      url: `/api/v1/trends/topics`,
    });
  };
}
