import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import {
  fetchLatestComponents,
  sortTopicWithSemver,
  sortTopicPerProduct,
  groupTopicsPerProduct,
} from "./topicsActions";
import { IEnhancedTopic, ITopic } from "types";

const axiosMock = new axiosMockAdapter(axios);

test("fetchLatestComponents", () => {
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/topics/t1/components", {
      params: {
        sort: "-created_at",
        limit: 1,
        offset: 0,
        where: "type:Compose,state:active",
      },
    })
    .reply(200, { components: [{ id: "c11" }] });
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/topics/t1/components", {
      params: {
        sort: "-created_at",
        limit: 1,
        offset: 0,
        where: "type:Harness,state:active",
      },
    })
    .reply(200, { components: [{ id: "c12" }] });
  return fetchLatestComponents({
    id: "t1",
    component_types: ["Compose", "Harness"],
  } as ITopic).then((r) => {
    expect(r.data).toEqual({
      components: [{ id: "c11" }, { id: "c12" }],
    });
  });
});

test("sortTopicWithSemver", () => {
  expect([].sort(sortTopicWithSemver)).toEqual([]);
  expect(
    [
      { name: "OSP16.2" } as ITopic,
      { name: "OSP10" } as ITopic,
      { name: "OSP16.1" } as ITopic,
    ].sort(sortTopicWithSemver)
  ).toEqual([{ name: "OSP16.2" }, { name: "OSP16.1" }, { name: "OSP10" }]);
  expect(
    [
      { name: "OCP-4.10" } as ITopic,
      { name: "OCP-4.4" } as ITopic,
      { name: "OCP-4.5" } as ITopic,
    ].sort(sortTopicWithSemver)
  ).toEqual([{ name: "OCP-4.10" }, { name: "OCP-4.5" }, { name: "OCP-4.4" }]);
  expect(
    [
      { name: "RHEL-8.1" } as ITopic,
      { name: "RHEL-8.0" } as ITopic,
      { name: "RHEL-8.5" } as ITopic,
    ].sort(sortTopicWithSemver)
  ).toEqual([{ name: "RHEL-8.5" }, { name: "RHEL-8.1" }, { name: "RHEL-8.0" }]);
});

test("sortTopicPerProduct", () => {
  const topic1: IEnhancedTopic = {
    name: "OSP16.2",
    product: {
      id: "p1",
      name: "OpenStack",
    },
  } as IEnhancedTopic;
  const topic2: IEnhancedTopic = {
    name: "OCP-4.10",
    product: {
      id: "p2",
      name: "OpenShift",
    },
  } as IEnhancedTopic;
  const topic3: IEnhancedTopic = {
    name: "OCP-4.9",
    product: {
      id: "p2",
      name: "OpenShift",
    },
  } as IEnhancedTopic;
  const topic4: IEnhancedTopic = {
    name: "RHEL-8.5",
    product: {
      id: "p3",
      name: "RHEL",
    },
  } as IEnhancedTopic;
  expect([topic1, topic2, topic3, topic4].sort(sortTopicPerProduct)).toEqual([
    topic2,
    topic3,
    topic4,
    topic1,
  ]);
});

test("groupTopicsPerProduct", () => {
  const topic1: IEnhancedTopic = {
    name: "OCP-4.10",
    product: {
      id: "p1",
      name: "OpenShift",
    },
  } as IEnhancedTopic;
  const topic2: IEnhancedTopic = {
    name: "OCP-4.9",
    product: {
      id: "p1",
      name: "OpenShift",
    },
  } as IEnhancedTopic;
  const topic3: IEnhancedTopic = {
    name: "RHEL-8.5",
    product: {
      id: "p2",
      name: "RHEL",
    },
  } as IEnhancedTopic;
  const topic4: IEnhancedTopic = {
    name: "OSP16.2",
    product: {
      id: "p3",
      name: "OpenStack",
    },
  } as IEnhancedTopic;
  const topics = [topic1, topic2, topic3, topic4];
  expect(groupTopicsPerProduct(topics)).toEqual([
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
