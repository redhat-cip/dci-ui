import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Bullseye,
  Text,
} from "@patternfly/react-core";
import { BlinkLogo } from "ui";

interface LoadingPageProps {
  title: string;
  description?: string;
  [x: string]: any;
}

export default function LoadingPage({
  title,
  description,
  ...props
}: LoadingPageProps) {
  return (
    <div {...props}>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{title}</Text>
          {description ? <Text component="p">{description}</Text> : null}
        </TextContent>
      </PageSection>
      <Bullseye>
        <BlinkLogo />
      </Bullseye>
    </div>
  );
}
