import React from "react";
import {
  Bullseye,
  Page,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
} from "@patternfly/react-core";
import { BackgroundImage } from "../ui";

const Page404 = () => (
  <Page header={null} sidebar={null}>
    <BackgroundImage />
    <Bullseye>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">404</Text>
          <Text component="p">
            we are looking for your page...but we can't find it
          </Text>
        </TextContent>
      </PageSection>
    </Bullseye>
  </Page>
);

export default Page404;
