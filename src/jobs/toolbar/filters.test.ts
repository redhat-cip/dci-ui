import {
  parseFiltersFromSearch,
  getParamsFromFilters,
  createSearchFromFilters,
} from "./filters";
import { IJobStateStatus } from "types";

it("parse filters from search", () => {
  const search =
    "?page=2&perPage=40&where=product_id:p1,team_id:t1,remoteci_id:r1,topic_id:to1,status:success,tags:tag_1,tags:tag_2";
  const expectedFilters = {
    team_id: "t1",
    product_id: "p1",
    topic_id: "to1",
    remoteci_id: "r1",
    tags: ["tag_1", "tag_2"],
    status: "success",
    page: 2,
    perPage: 40,
  };
  expect(parseFiltersFromSearch(search)).toEqual(expectedFilters);
});

it("parse filters from empty search", () => {
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
  };
  expect(parseFiltersFromSearch(search)).toEqual(expectedFilters);
});

it("get params from default filters", () => {
  const filters = {
    team_id: null,
    product_id: null,
    topic_id: null,
    remoteci_id: null,
    tags: [],
    status: null,
    page: 1,
    perPage: 20,
  };
  const expectedParams = {
    limit: 20,
    offset: 0,
  };
  expect(getParamsFromFilters(filters)).toEqual(expectedParams);
});

it("get params from complex filters", () => {
  const filters = {
    product_id: "p1",
    team_id: "t1",
    remoteci_id: "r1",
    topic_id: "to1",
    status: "success" as IJobStateStatus,
    tags: ["tag_1", "tag_2"],
    page: 2,
    perPage: 40,
  };

  const expectedParams = {
    limit: 40,
    offset: 40,
    where:
      "product_id:p1,team_id:t1,remoteci_id:r1,topic_id:to1,status:success,tags:tag_1,tags:tag_2",
  };
  expect(getParamsFromFilters(filters)).toEqual(expectedParams);
});

it("create search from filters", () => {
  const filters = {
    product_id: "p1",
    team_id: "t1",
    remoteci_id: "r1",
    topic_id: "to1",
    status: "success" as IJobStateStatus,
    tags: ["tag_1", "tag_2"],
    page: 2,
    perPage: 40,
  };
  const expectedSearch =
    "?page=2&perPage=40&where=product_id:p1,team_id:t1,remoteci_id:r1,topic_id:to1,status:success,tags:tag_1,tags:tag_2";
  expect(createSearchFromFilters(filters)).toEqual(expectedSearch);
});

it("create search from filters remove duplicate tags", () => {
  const filters = {
    product_id: "p1",
    team_id: "t1",
    remoteci_id: "r1",
    topic_id: "to1",
    status: "success" as IJobStateStatus,
    tags: ["tag_1", "tag_2", "tag_2"],
    page: 2,
    perPage: 40,
  };
  const expectedSearch =
    "?page=2&perPage=40&where=product_id:p1,team_id:t1,remoteci_id:r1,topic_id:to1,status:success,tags:tag_1,tags:tag_2";
  expect(createSearchFromFilters(filters)).toEqual(expectedSearch);
});

it("get params from user filters", () => {
  const filters = {
    email: "test@example.org",
    page: 1,
    perPage: 20,
  };
  const expectedParams = {
    where: "email:test@example.org",
    limit: 20,
    offset: 0,
  };
  expect(getParamsFromFilters(filters)).toEqual(expectedParams);
});
