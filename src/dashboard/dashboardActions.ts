import http from "services/http";
import { AxiosRequestConfig } from "axios";
import { IStat } from "types";
import { get } from "lodash";

export type ProductDashboard = {
  id: string;
  name: string;
  stats: IStat[];
};

export type Dashboard = {
  [key: string]: ProductDashboard;
};

export function getStats(): Promise<Dashboard> {
  const request = {
    method: "get",
    url: `/api/v1/stats`,
  } as AxiosRequestConfig;
  return http(request).then((response) => {
    const stats = response.data.stats as IStat[];
    const productsStats = stats.reduce((acc, stat) => {
      const product = stat.product;
      if (!product) {
        return acc;
      }
      const productId = product.id;
      const currentProduct = get(acc, productId, {
        ...product,
        stats: [],
      }) as ProductDashboard;
      currentProduct.stats.push(stat);
      acc[productId] = currentProduct;
      return acc;
    }, {} as Dashboard);
    return Promise.resolve(productsStats);
  });
}

export function getStat(topicName: string): Promise<IStat | null> {
  return getStats().then((dashboard) => {
    let result = null;
    const products = Object.values(dashboard);
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      for (let j = 0; j < product.stats.length; j++) {
        const stat = product.stats[j];
        if (stat.topic.name === topicName) {
          result = stat;
          break;
        }
      }
      if (result) break;
    }
    return Promise.resolve(result);
  });
}
