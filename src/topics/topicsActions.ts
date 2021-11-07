import http from "services/http";
import { createActions } from "api/apiActions";
import { IComponent, IEnhancedTopic, IProduct, ITopic } from "types";
import { get, padStart } from "lodash";

export default createActions("topic");

interface IFetchLatestComponents {
  data: {
    components: IComponent[];
  };
}

export function fetchLatestComponents(
  topic: ITopic
): Promise<IFetchLatestComponents> {
  return Promise.all(
    topic.component_types.map((componentType) =>
      http({
        method: "get",
        url: `/api/v1/topics/${topic.id}/components`,
        params: {
          sort: "-created_at",
          limit: 1,
          offset: 0,
          where: `type:${componentType},state:active`,
        },
      })
    )
  ).then((results) => {
    const components = results.reduce(
      (acc, result) => acc.concat(result.data.components),
      [] as IComponent[]
    );
    return Promise.resolve({ data: { components } });
  });
}

type DictWithName = {
  [x: string]: any;
  name: string;
};

export function sortTopicWithSemver(
  t1: DictWithName,
  t2: DictWithName
): number {
  const paddedName1 = t1.name.replace(/\d+/g, (n) => padStart(n, 6));
  const paddedName2 = t2.name.replace(/\d+/g, (n) => padStart(n, 6));
  if (paddedName1 < paddedName2) return -1;
  if (paddedName1 > paddedName2) return 1;
  return 0;
}

interface IProductWithTopics extends IProduct {
  topics: IEnhancedTopic[];
}

export function orderTopicsByProduct(
  topics: IEnhancedTopic[]
): IProductWithTopics[] {
  const topicsPerProduct = topics.reduce((acc, topic) => {
    const product = topic.product;
    if (!product) {
      return acc;
    }
    const productName = product.name.toLowerCase();
    const currentProduct = get(acc, productName, {
      ...product,
      topics: [],
    } as IProductWithTopics);
    currentProduct.topics.push(topic);
    acc[productName] = currentProduct;
    return acc;
  }, {} as { [productName: string]: IProductWithTopics });
  return Object.values(topicsPerProduct)
    .sort((p1, p2) => {
      const lowercaseProductsOrder = ["openshift", "rhel", "openstack"];
      return (
        lowercaseProductsOrder.indexOf(p1.name.toLowerCase()) -
        lowercaseProductsOrder.indexOf(p2.name.toLowerCase())
      );
    })
    .map((productWithTopics) => {
      productWithTopics.topics =
        productWithTopics.topics.sort(sortTopicWithSemver);
      return productWithTopics;
    });
}

interface IFetchComponents {
  data: {
    components: IComponent[];
  };
}

export function fetchComponents(topic: ITopic): Promise<IFetchComponents> {
  return http({
    method: "get",
    url: `/api/v1/topics/${topic.id}/components`,
    params: {
      sort: "-created_at",
      where: `state:active`,
    },
  });
}
