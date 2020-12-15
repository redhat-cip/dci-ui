import http from "services/http";
import { AppThunk } from "store";
import { IComponentWithJobs } from "types";
import { AxiosPromise } from "axios";

interface IFetchComponent {
  component: IComponentWithJobs;
}

// todo remove app thunk
export function fetchComponent(
  id: string
): AppThunk<AxiosPromise<IFetchComponent>> {
  return () => {
    return http({
      method: "get",
      url: `/api/v1/components/${id}`,
      params: { embed: "jobs" },
    });
  };
}
