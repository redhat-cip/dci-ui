import { api } from "api";
import { IStat } from "types";

type JobPerRemoteciStat = {
  id: string;
  name: string;
  stats: IStat[];
};

type JobPerRemoteciStats = {
  [key: string]: JobPerRemoteciStat;
};

export const { useLazyGetStatsQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getStats: builder.query<JobPerRemoteciStat[], void>({
        query: () => "/stats",
        transformResponse: (response: { stats: IStat[] }) => {
          const stats = response.stats as IStat[];
          const productsStats = stats.reduce((acc, stat) => {
            const product = stat.product;
            if (!product) {
              return acc;
            }
            const productId = product.id;
            const currentProduct = (acc[productId] ?? {
              ...product,
              stats: [],
            }) as JobPerRemoteciStat;
            currentProduct.stats.push(stat);
            acc[productId] = currentProduct;
            return acc;
          }, {} as JobPerRemoteciStats);
          return Promise.resolve(Object.values(productsStats));
        },
        providesTags: ["Analytics"],
      }),
    }),
  });
