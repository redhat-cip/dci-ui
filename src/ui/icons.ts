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
  return get(icons, product_name.toLocaleLowerCase(), BoxIcon);
}

export default {
  getProductIcon,
};
