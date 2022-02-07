import { Label } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  BugIcon,
  ExclamationCircleIcon,
  StopCircleIcon,
  InProgressIcon,
} from "@patternfly/react-icons";
import { IJobStatus } from "types";

export default function JobStatusLabel({
  status,
  ...props
}: {
  status: IJobStatus;
  [k: string]: any;
}) {
  switch (status) {
    case "success":
      return (
        <Label isCompact color="green" icon={<CheckCircleIcon />} {...props}>
          {status}
        </Label>
      );
    case "failure":
      return (
        <Label isCompact color="red" icon={<BugIcon />} {...props}>
          {status}
        </Label>
      );
    case "error":
      return (
        <Label
          isCompact
          color="red"
          icon={<ExclamationCircleIcon />}
          {...props}
        >
          {status}
        </Label>
      );
    case "killed":
      return (
        <Label isCompact color="orange" icon={<StopCircleIcon />} {...props}>
          {status}
        </Label>
      );
    default:
      return (
        <Label isCompact color="blue" icon={<InProgressIcon />} {...props}>
          {status}
        </Label>
      );
  }
}
