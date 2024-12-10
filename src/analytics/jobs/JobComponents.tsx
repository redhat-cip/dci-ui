import { Label, Tooltip } from "@patternfly/react-core";
import { humanizeDurationShort } from "services/date";
import { IAnalyticsJob } from "types";

export function humanizeJobDuration(duration: number) {
  return humanizeDurationShort(duration * 1000, {
    delimiter: " ",
    round: true,
    largest: 2,
  });
}

export function JobComment({
  comment,
  status_reason,
}: {
  comment: IAnalyticsJob["comment"];
  status_reason: IAnalyticsJob["status_reason"];
}) {
  if (!comment) {
    return null;
  }
  if (!status_reason) {
    <span
      style={{
        textDecorationLine: "underline",
        textDecorationStyle: "dashed",
        textDecorationColor: "#000",
      }}
    >
      {comment}
    </span>;
  }
  return (
    <Tooltip content={<div>{status_reason}</div>}>
      <span
        style={{
          textDecorationLine: "underline",
          textDecorationStyle: "dashed",
          textDecorationColor: "#000",
        }}
      >
        {comment}
      </span>
    </Tooltip>
  );
}

export function JobResults({ results }: { results: IAnalyticsJob["results"] }) {
  if (!results) {
    return null;
  }
  return (
    <span>
      <Label
        isCompact
        color="green"
        title={`${results.success || 0} tests in success`}
        className="pf-v6-u-mr-xs"
      >
        {results.success || 0}
      </Label>
      <Label
        isCompact
        color="orange"
        title={`${results.skips || 0} skipped tests`}
        className="pf-v6-u-mr-xs"
      >
        {results.skips || 0}
      </Label>
      <Label
        isCompact
        color="red"
        title={`${
          (results.failures || 0) + (results.errors || 0)
        } errors and failures tests`}
      >
        {(results.failures || 0) + (results.errors || 0)}
      </Label>
    </span>
  );
}
