import { createSelector } from "reselect";
import { getProductsById } from "products/productsSelectors";
import { fromNow } from "services/date";
import { RootState } from "store";
import { ITopicsById } from "types";
import { sortTopicPerProduct, sortTopicWithSemver } from "./topicsActions";

export const getTopicsById = (state: RootState): ITopicsById =>
  state.topics.byId;

export const getTopicsAllIds = (state: RootState): string[] =>
  state.topics.allIds;

export const getTopicById = (id: string | null | undefined) => {
  return createSelector(getProductsById, getTopicsById, (products, topics) => {
    if (id === null || id === undefined) return null;
    const topic = topics[id];
    if (!topic) return null;
    return {
      ...topic,
      product: topic.product_id ? products[topic.product_id] : null,
      from_now: fromNow(topic.created_at),
    };
  });
};

export const isFetchingTopics = (state: RootState): boolean =>
  state.topics.isFetching || state.products.isFetching;

export const getTopics = createSelector(
  getProductsById,
  getTopicsById,
  getTopicsAllIds,
  (products, topics, topicsAllIds) =>
    topicsAllIds
      .map((id) => {
        const topic = topics[id];
        return {
          ...topic,
          product: topic.product_id ? products[topic.product_id] : null,
          from_now: fromNow(topic.created_at),
        };
      })
      .sort(sortTopicWithSemver)
      .sort(sortTopicPerProduct)
);

export const getActiveTopics = createSelector(getTopics, (topics) =>
  topics.filter((t) => t.state === "active")
);
