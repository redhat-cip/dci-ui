import { Bullseye, Page } from "@patternfly/react-core";
import { BlinkLogo, BackgroundImage } from "ui";

export default function NotAuthenticatedLoadingPage() {
  return (
    <Page header={null} sidebar={null}>
      <Bullseye>
        <BlinkLogo />
      </Bullseye>
    </Page>
  );
}
