import { IResult, ITest } from "types";
import { sumTests } from "./TestsLabels";

test("sumTests no tests", () => {
  expect(sumTests([])).toEqual({
    total: 0,
    success: 0,
    skips: 0,
    failures: 0,
    errors: 0,
    successfixes: 0,
    regressions: 0,
  });
});

test("sumTests one test", () => {
  expect(
    sumTests([
      {
        success: 1,
        skips: 0,
        failures: 0,
        errors: 0,
        successfixes: 0,
        regressions: 0,
      } as IResult,
    ]),
  ).toEqual({
    total: 1,
    success: 1,
    skips: 0,
    failures: 0,
    errors: 0,
    successfixes: 0,
    regressions: 0,
  });
});

test("sumTests two tests", () => {
  expect(
    sumTests([
      {
        success: 1,
        skips: 0,
        failures: 0,
        errors: 0,
        successfixes: 0,
        regressions: 1,
      } as IResult,
      {
        success: 1,
        skips: 2,
        failures: 1,
        errors: 3,
        successfixes: 1,
        regressions: 0,
      } as IResult,
    ]),
  ).toEqual({
    total: 8,
    success: 2,
    skips: 2,
    failures: 1,
    errors: 3,
    successfixes: 1,
    regressions: 1,
  });
});

test("sumTests with ITests", () => {
  expect(
    sumTests([
      {
        success: 1,
        skips: 0,
        failures: 0,
        errors: 0,
        successfixes: 0,
        regressions: 1,
      } as ITest,
      {
        success: 1,
        skips: 2,
        failures: 1,
        errors: 3,
        successfixes: 1,
        regressions: 0,
      } as ITest,
    ]),
  ).toEqual({
    total: 8,
    success: 2,
    skips: 2,
    failures: 1,
    errors: 3,
    successfixes: 1,
    regressions: 1,
  });
});
