import React, { Component } from "react";
import {
  Bullseye,
  Page,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text
} from "@patternfly/react-core";

export default class Page404 extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="pf-c-background-image" />
        <Page header={null} sidebar={null}>
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
      </React.Fragment>
    );
  }
}
