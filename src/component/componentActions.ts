import http from "services/http";
import { AppThunk } from "store";
import { IComponent } from "types";
import { AxiosPromise } from "axios";

interface IFetchComponent {
  component: IComponent;
}

export function fetchComponent(
  id: string
): AppThunk<AxiosPromise<IFetchComponent>> {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/components/${id}`,
    });
  };
}
