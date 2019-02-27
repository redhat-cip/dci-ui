import React, { Component } from "react";
import { isEmpty } from "lodash";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Bullseye,
  Text
} from "@patternfly/react-core";
import { BlinkLogo } from "ui";
import MainContent from "./MainContent";

export default class Page extends Component {
  render() {
    const {
      HeaderSection,
      HeaderButton,
      title,
      description,
      Toolbar,
      loading,
      empty,
      EmptyComponent,
      children,
      ...props
    } = this.props;
    return (
      <MainContent {...props}>
        {isEmpty(HeaderSection) ? (
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">{title}</Text>
              {HeaderButton}
              {description ? <Text component="p">{description}</Text> : null}
            </TextContent>
            {!isEmpty(Toolbar) && Toolbar}
          </PageSection>
        ) : (
          HeaderSection
        )}
        <PageSection>
          {loading ? (
            <Bullseye>
              <BlinkLogo />
            </Bullseye>
          ) : null}
          {!loading && empty ? <Bullseye>{EmptyComponent}</Bullseye> : null}
          {!loading && !empty ? children : null}
        </PageSection>
      </MainContent>
    );
  }
}
