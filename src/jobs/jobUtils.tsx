import {
  global_danger_color_100,
  global_success_color_100,
  global_active_color_100,
  global_warning_color_100,
  global_Color_light_100,
} from "@patternfly/react-tokens";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  BugIcon,
  StopCircleIcon,
  InProgressIcon,
} from "@patternfly/react-icons";

export function getBackground(
  status: string,
  backgroundColor: string = global_Color_light_100.value
) {
  switch (status) {
    case "success":
      return `linear-gradient(to right,${global_success_color_100.value} 0,${global_success_color_100.value} 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "failure":
    case "error":
      return `linear-gradient(to right,${global_danger_color_100.value} 0,${global_danger_color_100.value} 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "killed":
      return `linear-gradient(to right,${global_warning_color_100.value} 0,${global_warning_color_100.value} 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    default:
      return `linear-gradient(to right,${global_active_color_100.value} 0,${global_active_color_100.value} 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
  }
}

export function getIcon(status: string) {
  switch (status) {
    case "success":
      return <CheckCircleIcon />;
    case "failure":
      return <BugIcon />;
    case "error":
      return <ExclamationCircleIcon />;
    case "killed":
      return <StopCircleIcon />;
    default:
      return <InProgressIcon />;
  }
}

export function getColor(status: string) {
  switch (status) {
    case "success":
      return global_success_color_100.value;
    case "failure":
      return global_danger_color_100.value;
    case "error":
      return global_danger_color_100.value;
    case "killed":
      return global_warning_color_100.value;
    default:
      return global_active_color_100.value;
  }
}

export function convertLinksToHtml(text: string | null | undefined) {
  if (!text) return "";
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
  return text.replace(urlRegex, '<a href="$&">$&</a>');
}
