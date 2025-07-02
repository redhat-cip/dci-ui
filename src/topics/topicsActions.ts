import type { IProduct, ITopic } from "types";

interface IProductWithTopics extends IProduct {
  topics: ITopic[];
}

export function groupTopicsPerProduct(
  topics: ITopic[],
  products: IProduct[],
): IProductWithTopics[] {
  const productById = products.reduce(
    (acc, product) => {
      acc[product.id] = product;
      return acc;
    },
    {} as { [k: string]: IProduct },
  );
  const topicsPerProduct = topics.reduce(
    (acc, topic) => {
      const product = productById[topic.product_id];
      if (!product) {
        return acc;
      }
      const productName = product.name.toLowerCase();
      const currentProduct =
        acc[productName] ||
        ({
          ...product,
          topics: [],
        } as IProductWithTopics);
      currentProduct.topics.push(topic);
      acc[productName] = currentProduct;
      return acc;
    },
    {} as { [productName: string]: IProductWithTopics },
  );
  return Object.values(topicsPerProduct);
}
