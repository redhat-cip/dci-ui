import { Label, LabelGroup } from "@patternfly/react-core";
import type { IKeyValue } from "types";

export default function JobKeysValues({
  keys_values = [],
}: {
  keys_values?: IKeyValue[];
}) {
  return (
    <LabelGroup numLabels={10} isCompact>
      {keys_values.map((kv, index) => (
        <Label key={index} color="blue" isCompact>
          {kv.key}:{kv.value}
        </Label>
      ))}
    </LabelGroup>
  );
}
