import {
  parseFiltersFromSearch,
  getParamsFromFilters,
  createSearchFromFilters,
  resetPageIfNeeded,
} from "./filters";
import { IJobStatus } from "types";

describe("parse filters", () => {
  it("from search", () => {
    const search =
      "?page=2&perPage=40&where=product_id:p1,team_id:t1,remoteci_id:r1,topic_id:to1,status:success,tags:tag_1,tags:tag_2,configuration:config1,name:name1";
    const expectedFilters = {
      team_id: "t1",
      product_id: "p1",
      topic_id: "to1",
      remoteci_id: "r1",
      tags: ["tag_1", "tag_2"],
      status: "success",
      page: 2,
      perPage: 40,
      configuration: "config1",
      name: "name1",
    };
    expect(parseFiltersFromSearch(search)).toEqual(expectedFilters);
  });

  it("from search with more complex tag", () => {
    const search =
      "?page=1&perPage=20&where=tags:job:fake-cnf,tags:inventory:cluster6-post.yml";
    const expectedFilters = {
      team_id: null,
      product_id: null,
      topic_id: null,
      remoteci_id: null,
      tags: ["job:fake-cnf", "inventory:cluster6-post.yml"],
      status: null,
      page: 1,
      perPage: 20,
      configuration: null,
      name: null,
    };
    expect(parseFiltersFromSearch(search)).toEqual(expectedFilters);
  });

  it("from empty search", () => {
    const search = "";
    const expectedFilters = {
      team_id: null,
      product_id: null,
      topic_id: null,
      remoteci_id: null,
      tags: [],
      status: null,
      page: 1,
      perPage: 20,
      configuration: null,
      name: null,
    };
    expect(parseFiltersFromSearch(search)).toEqual(expectedFilters);
  });

  it("nrt when user change only the page and perPage value", () => {
    const search = "?page=2&perPage=50";
    const expectedFilters = {
      team_id: null,
      product_id: null,
      topic_id: null,
      remoteci_id: null,
      tags: [],
      status: null,
      page: 2,
      perPage: 50,
      configuration: null,
      name: null,
    };
    expect(parseFiltersFromSearch(search)).toEqual(expectedFilters);
  });
});

test("get params from default filters", () => {
  const filters = {
    team_id: null,
    product_id: null,
    topic_id: null,
    remoteci_id: null,
    tags: [],
    status: null,
    page: 1,
    perPage: 20,
    configuration: null,
    name: null,
  };
  const expectedParams = {
    limit: 20,
    offset: 0,
  };
  expect(getParamsFromFilters(filters)).toEqual(expectedParams);
});

test("get params from complex filters", () => {
  const filters = {
    product_id: "p1",
    team_id: "t1",
    remoteci_id: "r1",
    topic_id: "to1",
    status: "success" as IJobStatus,
    tags: ["tag_1", "tag_2"],
    page: 2,
    perPage: 40,
    configuration: "config2",
    name: "name2",
  };

  const expectedParams = {
    limit: 40,
    offset: 40,
    where:
      "product_id:p1,team_id:t1,remoteci_id:r1,topic_id:to1,status:success,tags:tag_1,tags:tag_2,configuration:config2,name:name2",
  };
  expect(getParamsFromFilters(filters)).toEqual(expectedParams);
});

test("create search from filters", () => {
  const filters = {
    product_id: "p1",
    team_id: "t1",
    remoteci_id: "r1",
    topic_id: "to1",
    status: "success" as IJobStatus,
    tags: ["tag_1", "tag_2"],
    page: 2,
    perPage: 40,
    configuration: "config2",
    name: "name2",
  };
  const expectedSearch =
    "?page=2&perPage=40&where=product_id:p1,team_id:t1,remoteci_id:r1,topic_id:to1,status:success,tags:tag_1,tags:tag_2,configuration:config2,name:name2";
  expect(createSearchFromFilters(filters)).toEqual(expectedSearch);
});

test("create search from filters remove duplicate tags", () => {
  const filters = {
    product_id: "p1",
    team_id: "t1",
    remoteci_id: "r1",
    topic_id: "to1",
    status: "success" as IJobStatus,
    tags: ["tag_1", "tag_2", "tag_2"],
    page: 2,
    perPage: 40,
    configuration: "config2",
    name: "name2",
  };
  const expectedSearch =
    "?page=2&perPage=40&where=product_id:p1,team_id:t1,remoteci_id:r1,topic_id:to1,status:success,tags:tag_1,tags:tag_2,configuration:config2,name:name2";
  expect(createSearchFromFilters(filters)).toEqual(expectedSearch);
});

test("get params from user filters", () => {
  const filters = {
    email: "test@example.org",
    page: 1,
    perPage: 20,
    sort: "created_at",
  };
  const expectedParams = {
    where: "email:test@example.org",
    limit: 20,
    offset: 0,
    sort: "created_at",
  };
  expect(getParamsFromFilters(filters)).toEqual(expectedParams);
});

describe("reset filters", () => {
  it("set page to 1 if user change another filter than page", () => {
    const oldFilters = {
      product_id: "p1",
      team_id: "t1",
      remoteci_id: "r1",
      topic_id: "to1",
      status: null,
      tags: ["tag_1", "tag_2"],
      page: 2,
      perPage: 40,
      configuration: "config2",
      name: "name2",
    };
    const newFilters = {
      product_id: "p1",
      team_id: "t1",
      remoteci_id: "r1",
      topic_id: "to1",
      status: "success" as IJobStatus,
      tags: ["tag_1", "tag_2"],
      page: 2,
      perPage: 40,
      configuration: "config2",
      name: "name2",
    };
    const expectedFilters = {
      product_id: "p1",
      team_id: "t1",
      remoteci_id: "r1",
      topic_id: "to1",
      status: "success" as IJobStatus,
      tags: ["tag_1", "tag_2"],
      page: 1,
      perPage: 40,
      configuration: "config2",
      name: "name2",
    };
    expect(resetPageIfNeeded(oldFilters, newFilters)).toEqual(
      expectedFilters
    );
  });
  it("don't reset page to 1 if user change the page", () => {
    const oldFilters = {
      team_id: null,
      product_id: null,
      topic_id: null,
      remoteci_id: null,
      tags: [],
      status: null,
      page: 1,
      perPage: 20,
      configuration: null,
      name: null,
    };
    const newFilters = {
      team_id: null,
      product_id: null,
      topic_id: null,
      remoteci_id: null,
      tags: [],
      status: null,
      page: 2,
      perPage: 20,
      configuration: null,
      name: null,
    };
    const expectedFilters = {
      team_id: null,
      product_id: null,
      topic_id: null,
      remoteci_id: null,
      tags: [],
      status: null,
      page: 2,
      perPage: 20,
      configuration: null,
      name: null,
    };
    expect(resetPageIfNeeded(oldFilters, newFilters)).toEqual(
      expectedFilters
    );
  });
});

