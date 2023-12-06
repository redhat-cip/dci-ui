import {
  injectCreateEndpoint,
  injectDeleteEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
} from "../api";
import type { IProduct } from "../types";

const resource = "Product";

export const { useCreateProductMutation } =
  injectCreateEndpoint<IProduct>(resource);
export const { useDeleteProductMutation } =
  injectDeleteEndpoint<IProduct>(resource);
export const { useListProductsQuery } = injectListEndpoint<IProduct>(resource);
export const { useUpdateProductMutation } =
  injectUpdateEndpoint<IProduct>(resource);
