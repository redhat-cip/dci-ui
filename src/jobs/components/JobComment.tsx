import { Tooltip } from "@patternfly/react-core";
import type { IJob } from "types";

export default function JobComment({
  comment,
  status_reason,
}: {
  comment: IJob["comment"];
  status_reason: IJob["status_reason"];
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
