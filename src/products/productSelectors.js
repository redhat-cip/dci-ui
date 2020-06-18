import { createSelector } from "reselect";
import { sortByName } from "services/sort";
import { fromNow } from "services/date";

export const getProductsById = (state) => state.products.byId;
export const getProductsAllIds = (state) => state.products.allIds;
export const getProducts = createSelector(
  getProductsById,
  getProductsAllIds,
  (products, productsAllIds) =>
    sortByName(
      productsAllIds.map((id) => {
        const product = products[id];
        return {
          ...product,
          from_now: fromNow(product.created_at),
        };
      })
    )
);
