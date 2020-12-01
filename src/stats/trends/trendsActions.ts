import { AxiosPromise } from "axios";
import http from "services/http";
import { AppThunk } from "store";
import { ITrends } from "types";

interface IGetTrends {
  topics: ITrends;
}

export function getTrends(): AppThunk<AxiosPromise<IGetTrends>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/trends/topics`,
    });
  };
}
