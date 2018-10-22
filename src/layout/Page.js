import React, { Component } from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Bullseye,
  Text
} from "@patternfly/react-core";
import { BlinkLogo } from "../ui";
import MainContent from "./MainContent";

export default class Page extends Component {
  render() {
    const {
      HeaderButton,
      title,
      description,
      loading,
      empty,
      EmptyComponent,
      children,
      ...props
    } = this.props;
    return (
      <MainContent>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">{title}</Text>
            {HeaderButton}
            {description ? <Text component="p">{title}</Text> : null}
          </TextContent>
        </PageSection>
        <PageSection>
          {loading ? (
            <Bullseye>
              <BlinkLogo />
            </Bullseye>
          ) : null}
          {!loading && empty ? (
            <Bullseye>
              {EmptyComponent}
            </Bullseye>
          ) : null}
          {!loading && !empty ? children : null}
        </PageSection>
      </MainContent>
    );
  }
}
