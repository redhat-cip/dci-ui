import {
  BoxIcon,
  OpenshiftIcon,
  OpenstackIcon,
  RedhatIcon,
} from "@patternfly/react-icons";

export default function ProductIcon({
  name,
  ...props
}: {
  name: string;
  [key: string]: any;
}) {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName === "openshift") return <OpenshiftIcon {...props} />;
  if (lowercaseName === "openstack") return <OpenstackIcon {...props} />;
  if (lowercaseName === "rhel") return <RedhatIcon {...props} />;
  return <BoxIcon {...props} />;
}
