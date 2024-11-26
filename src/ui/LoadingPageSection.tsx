import { Bullseye, PageSection } from "@patternfly/react-core";
import BlinkLogo from "./blinkLogo/BlinkLogo";

export default function LoadingPageSection() {
  return (
    <PageSection>
      <Bullseye>
        <BlinkLogo />
      </Bullseye>
    </PageSection>
  );
}
