import {
  RedhatIcon,
  OpenshiftIcon,
  OpenstackIcon,
  BoxIcon,
} from "@patternfly/react-icons";
import { get } from "lodash";

export function getProductIcon(product_name: string) {
  const icons = {
    openshift: OpenshiftIcon,
    openstack: OpenstackIcon,
    rhel: RedhatIcon,
  };
  return get(icons, product_name.toLowerCase(), BoxIcon);
}

export function getTopicIcon(topic_name: string | null) {
  if (!topic_name) return BoxIcon;
  const topic_name_lower = topic_name.toLowerCase();
  if (topic_name_lower.startsWith("rhel")) return RedhatIcon;
  if (topic_name_lower.startsWith("ocp")) return OpenshiftIcon;
  if (topic_name_lower.startsWith("osp")) return OpenstackIcon;
  return BoxIcon;
}
