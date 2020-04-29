import React from "react";
import { Bullseye, Page } from "@patternfly/react-core";
import { BlinkLogo, BackgroundImage } from "ui";

const NotAuthenticatedLoadingPage = () => (
  <Page header={null} sidebar={null}>
    <BackgroundImage />
    <Bullseye>
      <BlinkLogo />
    </Bullseye>
  </Page>
);

export default NotAuthenticatedLoadingPage;
