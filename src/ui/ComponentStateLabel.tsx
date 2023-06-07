import { Label } from "@patternfly/react-core";
import { state } from "types";

export default function ComponentStateLabel({
  state,
  isCompact = false,
}: {
  state: state | string;
  isCompact?: boolean;
}) {
  if (state === "active") {
    return (
      <Label color="green" isCompact={isCompact}>
        {state}
      </Label>
    );
  }
  return (
    <Label color="red" isCompact={isCompact}>
      {state}
    </Label>
  );
}
