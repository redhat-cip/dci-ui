import React from "react";
import { isEmpty } from "lodash";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Bullseye,
  Text,
} from "@patternfly/react-core";
import { BlinkLogo } from "ui";
import AppLayout from "./AppLayout";

interface PageProps {
  HeaderSection?: React.ReactNode;
  HeaderButton?: React.ReactNode;
  title: string;
  description: string;
  Toolbar?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  EmptyComponent?: React.ReactNode;
  children: React.ReactNode;
  seeSecondToolbar?: boolean;
  [x: string]: any;
}

export default function Page({
  HeaderSection,
  HeaderButton,
  title,
  description,
  Toolbar,
  loading,
  empty,
  EmptyComponent,
  children,
  seeSecondToolbar = false,
  ...props
}: PageProps) {
  return (
    <AppLayout {...props}>
      {isEmpty(HeaderSection) ? (
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">{title}</Text>
            <Text component="p">{description}</Text>
            {HeaderButton}
          </TextContent>
        </PageSection>
      ) : (
        HeaderSection
      )}
      <PageSection variant={PageSectionVariants.default}>
        {!isEmpty(Toolbar) && (
          <PageSection variant={PageSectionVariants.light}>
            {Toolbar}
          </PageSection>
        )}
        {loading ? (
          <Bullseye>
            <BlinkLogo />
          </Bullseye>
        ) : null}
        {!loading && empty ? (
          <PageSection variant={PageSectionVariants.light}>
            <Bullseye>{EmptyComponent}</Bullseye>
          </PageSection>
        ) : null}
        {!loading && !empty ? children : null}
        {!loading && !empty && !isEmpty(Toolbar) && seeSecondToolbar && (
          <PageSection variant={PageSectionVariants.light}>
            {Toolbar}
          </PageSection>
        )}
      </PageSection>
    </AppLayout>
  );
}
