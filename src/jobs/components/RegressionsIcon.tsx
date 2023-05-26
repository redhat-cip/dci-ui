import { WarningTriangleIcon } from "@patternfly/react-icons";

interface RegressionsIconProps {
  regressions: number;
  [x: string]: any;
}

export default function RegressionsIcon({
  regressions,
  ...props
}: RegressionsIconProps) {
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
