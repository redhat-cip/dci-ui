import {
  createJunitComparisonSearchFromFilters,
  JunitComparisonFilter,
  parseJunitComparisonFiltersFromSearch,
} from "./JunitComparisonPage";

it("parse filters from search", () => {
  const search =
    "?topic_1_id=to1&topic_1_start_date=2022-01-12&topic_1_end_date=2022-05-18&remoteci_1_id=r1&topic_1_baseline_computation=mean&topic_2_id=to2&topic_2_start_date=2021-11-15&topic_2_end_date=2022-05-18&remoteci_2_id=r2&topic_2_baseline_computation=mean&test_name=test";
  const expectedFilters = {
    topic_1_id: "to1",
    topic_1_start_date: "2022-01-12",
    topic_1_end_date: "2022-05-18",
    remoteci_1_id: "r1",
    topic_1_baseline_computation: "mean",
    tags_1: [],
    topic_2_id: "to2",
    topic_2_start_date: "2021-11-15",
    topic_2_end_date: "2022-05-18",
    remoteci_2_id: "r2",
    topic_2_baseline_computation: "mean",
    tags_2: [],
    test_name: "test",
  };
  expect(parseJunitComparisonFiltersFromSearch(search)).toEqual(
    expectedFilters
  );
});

it("parse filters from empty search", () => {
  const search = "";
  const expectedFilters = {
    topic_1_id: null,
    topic_1_start_date: null,
    topic_1_end_date: null,
    remoteci_1_id: null,
    topic_1_baseline_computation: "mean",
    tags_1: [],
    topic_2_id: null,
    topic_2_start_date: null,
    topic_2_end_date: null,
    remoteci_2_id: null,
    topic_2_baseline_computation: "mean",
    tags_2: [],
    test_name: null,
  };
  expect(parseJunitComparisonFiltersFromSearch(search)).toEqual(
    expectedFilters
  );
});

test("create search from filters", () => {
  const filters = {
    topic_1_id: "to1",
    topic_1_start_date: "2022-01-12",
    topic_1_end_date: "2022-05-18",
    remoteci_1_id: "r1",
    topic_1_baseline_computation: "mean",
    tags_1: [],
    topic_2_id: "to2",
    topic_2_start_date: "2021-11-15",
    topic_2_end_date: "2022-05-18",
    remoteci_2_id: "r2",
    topic_2_baseline_computation: "mean",
    tags_2: [],
    test_name: "test",
  } as JunitComparisonFilter;
  const expectedSearch =
    "?topic_1_id=to1&topic_1_start_date=2022-01-12&topic_1_end_date=2022-05-18&remoteci_1_id=r1&topic_1_baseline_computation=mean&topic_2_id=to2&topic_2_start_date=2021-11-15&topic_2_end_date=2022-05-18&remoteci_2_id=r2&topic_2_baseline_computation=mean&test_name=test";
  expect(createJunitComparisonSearchFromFilters(filters)).toEqual(
    expectedSearch
  );
});

test("create search from filters remove null", () => {
  const filters = {
    topic_1_id: null,
    topic_1_start_date: null,
    topic_1_end_date: null,
    remoteci_1_id: null,
    topic_1_baseline_computation: "mean",
    tags_1: [],
    topic_2_id: null,
    topic_2_start_date: null,
    topic_2_end_date: null,
    remoteci_2_id: null,
    topic_2_baseline_computation: "mean",
    tags_2: [],
    test_name: null,
  } as JunitComparisonFilter;
  const expectedSearch = "";
  expect(createJunitComparisonSearchFromFilters(filters)).toEqual(
    expectedSearch
  );
});
