import {
  BoxIcon,
  OpenshiftIcon,
  OpenstackIcon,
  RedhatIcon,
} from "@patternfly/react-icons";

export default function TopicIcon({
  name,
  ...props
}: {
  name: string | null;
  [key: string]: any;
}) {
  if (name === null) return <BoxIcon {...props} />;
  const lowerTopicName = name.toLowerCase();
  if (lowerTopicName.startsWith("rhel")) return <RedhatIcon {...props} />;
  if (lowerTopicName.startsWith("ocp")) return <OpenshiftIcon {...props} />;
  if (lowerTopicName.startsWith("osp")) return <OpenstackIcon {...props} />;
  return <BoxIcon {...props} />;
}
