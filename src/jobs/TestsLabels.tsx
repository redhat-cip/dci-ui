import { Label, LabelGroup } from "@patternfly/react-core";
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
      <Label isCompact color="green" title={`${success} tests in success`}>
        {success}
      </Label>
      <Successfixes successfixes={successfixes} isCompact />
      <Label isCompact color="orange" title={`${skips} skipped tests`}>
        {skips}
      </Label>
      <Label
        isCompact
        color="red"
        title={`${errors} errors and ${failures} failed tests`}
      >
        {errors + failures}
      </Label>
      <Regressions regressions={regressions} isCompact />
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
