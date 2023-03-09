import { Label, LabelGroup, Tooltip } from "@patternfly/react-core";
import { IResult } from "types";
import { Regressions, Successfixes } from "./jobSummary/components";

export function TestLabels({
  success,
  skips,
  errors,
  failures,
  successfixes,
  regressions,
}: {
  success: number;
  skips: number;
  errors: number;
  failures: number;
  successfixes: number;
  regressions: number;
}) {
  return (
    <LabelGroup numLabels={5}>
      <Tooltip
        content={
          <div>
            <p>{`${success} successful test${success > 1 ? "s" : ""}`}</p>
            <p>
              {successfixes > 0 &&
                `${successfixes} test${
                  successfixes > 1 ? "s have" : " has"
                } gone green
                since the last job`}
            </p>
          </div>
        }
      >
        <Label isCompact color="green">
          {success}
          <Successfixes successfixes={successfixes} className="pf-u-ml-xs" />
        </Label>
      </Tooltip>
      <Tooltip
        content={
          <div>
            <p>{`${skips} test${skips > 1 ? "s" : ""} skipped`}</p>
          </div>
        }
      >
        <Label isCompact color="orange">
          {skips}
        </Label>
      </Tooltip>
      <Tooltip
        content={
          <div>
            <p>{`${errors} error${
              errors > 1 ? "s" : ""
            } and ${failures} failed test${
              errors + failures > 1 ? "s" : ""
            }`}</p>
            <p>
              {regressions > 0 &&
                `${regressions} test${
                  regressions > 1 ? "s have" : " has"
                } gone red since the last job`}
            </p>
          </div>
        }
      >
        <Label isCompact color="red">
          {errors + failures}
          <Regressions regressions={regressions} className="pf-u-ml-xs" />
        </Label>
      </Tooltip>
    </LabelGroup>
  );
}

export function TestsLabels({ tests }: { tests: IResult[] }) {
  const { success, skips, errors, failures, successfixes, regressions } =
    tests.reduce(
      (acc, test) => {
        acc.success += test.success;
        acc.skips += test.skips;
        acc.failures += test.failures;
        acc.errors += test.errors;
        acc.successfixes += test.successfixes;
        acc.regressions += test.regressions;
        return acc;
      },
      {
        success: 0,
        skips: 0,
        failures: 0,
        errors: 0,
        successfixes: 0,
        regressions: 0,
      }
    );
  return (
    <TestLabels
      success={success}
      skips={skips}
      failures={failures}
      errors={errors}
      successfixes={successfixes}
      regressions={regressions}
    />
  );
}
