import {
  t_global_color_nonstatus_red_200,
  t_global_color_nonstatus_green_200,
  t_global_color_nonstatus_blue_200,
  t_global_color_nonstatus_orange_200,
} from "@patternfly/react-tokens";
import { LabelProps } from "@patternfly/react-core";

export function getBackgroundColor(status: string) {
  switch (status) {
    case "success":
      return t_global_color_nonstatus_green_200.value;
    case "failure":
    case "error":
      return t_global_color_nonstatus_red_200.value;
    case "killed":
      return t_global_color_nonstatus_orange_200.value;
    default:
      return t_global_color_nonstatus_blue_200.value;
  }
}

export function getLabelColor(status: string): LabelProps["color"] {
  switch (status) {
    case "success":
      return "green";
    case "failure":
      return "red";
    case "error":
      return "red";
    case "killed":
      return "orange";
    default:
      return "blue";
  }
}

export function convertLinksToHtml(text: string | null | undefined) {
  if (!text) return "";
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
  return text.replace(urlRegex, '<a href="$&">$&</a>');
}
