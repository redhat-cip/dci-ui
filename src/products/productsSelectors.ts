import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { fromNow } from "services/date";
import { RootState } from "store";
import { IProductsById, IEnhancedProduct } from "types";

export const getProductsById = (state: RootState): IProductsById =>
  state.products.byId;
export const getProductsAllIds = (state: RootState): string[] =>
  state.products.allIds;
export const isFetchingProducts = (state: RootState): boolean =>
  state.products.isFetching;
export const getProducts = createSelector(
  getProductsById,
  getProductsAllIds,
  (products, productsAllIds) =>
    sortByName<IEnhancedProduct>(
      productsAllIds.map((id) => {
        const product = products[id];
        return {
          ...product,
          from_now: fromNow(product.created_at),
        };
      }),
    ),
);
export const getProductById = (id: string | null) =>
  createSelector(getProductsById, (products) => {
    if (id && id in products) return products[id];
    return null;
  });
