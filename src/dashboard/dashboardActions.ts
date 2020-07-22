import http from "services/http";
import { ThunkAction } from "redux-thunk";
import { AxiosRequestConfig } from "axios";
import { Action } from "redux";
import { State, Stat } from "types";
import { get } from "lodash";

export type ProductDashboard = {
  id: string;
  name: string;
  stats: Stat[];
};

export type Dashboard = {
  [key: string]: ProductDashboard;
};

export function getStats(): ThunkAction<
  Promise<Dashboard>,
  State,
  unknown,
  Action
> {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/stats`,
    } as AxiosRequestConfig;
    return http(request).then((response) => {
      const stats = response.data.stats as Stat[];
      const productsStats = stats.reduce((acc, stat) => {
        const product = stat.product;
        if (!product) {
          return acc;
        }
        const productName = product.name.toLowerCase();

        // todo gvincent: remove this when older topic name will be removed
        if (
          productName === "rhel" &&
          stat.topic.name.indexOf("milestone") === -1 &&
          stat.topic.name.indexOf("nightly") === -1
        ) {
          return acc;
        }
        // end todo

        const currentProduct = get(acc, productName, {
          ...product,
          stats: [],
        }) as ProductDashboard;
        currentProduct.stats.push(stat);
        acc[productName] = currentProduct;
        return acc;
      }, {} as Dashboard);
      return Promise.resolve(productsStats);
    });
  };
}
