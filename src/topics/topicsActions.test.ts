import { groupTopicsPerProduct } from "./topicsActions";
import { IProduct, ITopic } from "types";

test("groupTopicsPerProduct", () => {
  const topic1 = {
    name: "OCP-4.10",
    product_id: "p1",
  };
  const topic2 = {
    name: "OCP-4.9",
    product_id: "p1",
  };
  const topic3 = {
    name: "RHEL-8.5",
    product_id: "p2",
  };
  const topic4 = {
    name: "OSP16.2",
    product_id: "p3",
  };
  const topics = [topic1, topic2, topic3, topic4] as ITopic[];
  const products = [
    {
      id: "p1",
      name: "OpenShift",
    },
    {
      id: "p2",
      name: "RHEL",
    },
    {
      id: "p3",
      name: "OpenStack",
    },
  ] as IProduct[];
  expect(groupTopicsPerProduct(topics, products)).toEqual([
    {
      id: "p1",
      name: "OpenShift",
      topics: [topic1, topic2],
    },
    {
      id: "p2",
      name: "RHEL",
      topics: [topic3],
    },
    {
      id: "p3",
      name: "OpenStack",
      topics: [topic4],
    },
  ]);
});
