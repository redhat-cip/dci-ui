import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import {
  fetchLatestComponents,
  orderTopicsByProduct,
  sortTopicWithSemver,
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

test("order topics per product importance", () => {
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
  const topics = [topic1, topic2, topic3, topic4];
  expect(orderTopicsByProduct(topics)).toEqual([
    {
      id: "p2",
      name: "OpenShift",
      topics: [topic3, topic2],
    },
    {
      id: "p3",
      name: "RHEL",
      topics: [topic4],
    },
    {
      id: "p1",
      name: "OpenStack",
      topics: [topic1],
    },
  ]);
});

test("order topic by name with version", () => {
  expect([].sort(sortTopicWithSemver)).toEqual([]);
  expect(
    [{ name: "OSP16.2" }, { name: "OSP10" }, { name: "OSP16.1" }].sort(
      sortTopicWithSemver
    )
  ).toEqual([{ name: "OSP10" }, { name: "OSP16.1" }, { name: "OSP16.2" }]);
  expect(
    [{ name: "OCP-4.10" }, { name: "OCP-4.4" }, { name: "OCP-4.5" }].sort(
      sortTopicWithSemver
    )
  ).toEqual([{ name: "OCP-4.4" }, { name: "OCP-4.5" }, { name: "OCP-4.10" }]);
  expect(
    [
      { name: "RHEL-8-nightly" },
      { name: "RHEL-8.5-nightly" },
      { name: "RHEL-8.5-nightly" },
    ].sort(sortTopicWithSemver)
  ).toEqual([
    { name: "RHEL-8-nightly" },
    { name: "RHEL-8.5-nightly" },
    { name: "RHEL-8.5-nightly" },
  ]);
});
