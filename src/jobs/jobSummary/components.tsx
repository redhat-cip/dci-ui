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
    <span {...props}>
      <WarningTriangleIcon style={{ fontSize: "0.8em", marginRight: "1px" }} />
      {`+${regressions}`}
    </span>
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
    <span {...props}>
      <ThumbsUpIcon style={{ fontSize: "0.8em", marginRight: "1px" }} />
      {`+${successfixes}`}
    </span>
  );
}
