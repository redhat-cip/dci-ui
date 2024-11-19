import { PageSection, Bullseye } from "@patternfly/react-core";
import { BlinkLogo } from "ui";

export default function LoadingPage() {
  return (
    <PageSection>
      <Bullseye>
        <BlinkLogo />
      </Bullseye>
    </PageSection>
  );
}
