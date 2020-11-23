import React from "react";
import { Bullseye, Page } from "@patternfly/react-core";
import { BlinkLogo, BackgroundImage } from "ui";

export default function NotAuthenticatedLoadingPage() {
  return (
    <Page header={null} sidebar={null}>
      <BackgroundImage />
      <Bullseye>
        <BlinkLogo />
      </Bullseye>
    </Page>
  );
}
