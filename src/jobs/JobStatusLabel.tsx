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
}: {
  status: IJobStatus;
}) {
  switch (status) {
    case "success":
      return (
        <Label isCompact color="green" icon={<CheckCircleIcon />}>
          {status}
        </Label>
      );
    case "failure":
      return (
        <Label isCompact color="red" icon={<BugIcon />}>
          {status}
        </Label>
      );
    case "error":
      return (
        <Label isCompact color="red" icon={<ExclamationCircleIcon />}>
          {status}
        </Label>
      );
    case "killed":
      return (
        <Label isCompact color="orange" icon={<StopCircleIcon />}>
          {status}
        </Label>
      );
    default:
      return (
        <Label isCompact color="blue" icon={<InProgressIcon />}>
          {status}
        </Label>
      );
  }
}
