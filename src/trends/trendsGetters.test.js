import { getAveragePercentageOfSuccess } from "./trendsGetters";

it("getAveragePercentageOfSuccess", () => {
  const trend = [[1527552000, 3, 32], [1531699200, 3, 0], [1508630400, 6, 5]];
  expect(getAveragePercentageOfSuccess(trend)).toBe(54);
});

it("getAveragePercentageOfSuccess no trend", () => {
  const trend = [];
  expect(getAveragePercentageOfSuccess(trend)).toBe(0);
});
