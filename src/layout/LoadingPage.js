import React, { Component } from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Bullseye,
  Text
} from "@patternfly/react-core";
import { BlinkLogo } from "ui";
import MainContent from "./MainContent";

export default class LoadingPage extends Component {
  render() {
    const { title, description, ...props } = this.props;
    return (
      <MainContent {...props}>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">{title}</Text>
            {description ? <Text component="p">{description}</Text> : null}
          </TextContent>
        </PageSection>
        <Bullseye>
          <BlinkLogo />
        </Bullseye>
      </MainContent>
    );
  }
}
