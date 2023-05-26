import { ThumbsUpIcon } from "@patternfly/react-icons";

interface SuccessfixesIconProps {
  successfixes: number;
  [x: string]: any;
}

export default function SuccessfixesIcon({
  successfixes,
  ...props
}: SuccessfixesIconProps) {
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
