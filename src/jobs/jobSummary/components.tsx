import { Label } from "@patternfly/react-core";
import { WarningTriangleIcon, ThumbsUpIcon } from "@patternfly/react-icons";

interface RegressionsProps {
  regressions: number;
  [x: string]: any;
}

export function Regressions({ regressions, ...props }: RegressionsProps) {
  if (regressions === 0) {
    return null;
  }
  return (
    <Label icon={<WarningTriangleIcon />} color="red" {...props}>
      <span>{`${regressions} regression${regressions > 1 ? "s" : ""}`}</span>
    </Label>
  );
}

interface SuccessfixesProps {
  successfixes: number;
  [x: string]: any;
}

export function Successfixes({ successfixes, ...props }: SuccessfixesProps) {
  if (successfixes === 0) {
    return null;
  }
  return (
    <Label icon={<ThumbsUpIcon />} color="green" {...props}>
      <span>{`${successfixes} fix${successfixes > 1 ? "es" : ""}`}</span>
    </Label>
  );
}
