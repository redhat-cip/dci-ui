import * as React from "react";
import { PageSection, Content, Bullseye } from "@patternfly/react-core";
import { BlinkLogo } from "ui";
import { useTitle } from "hooks/useTitle";

interface PageProps {
  HeaderSection?: React.ReactNode;
  HeaderButton?: React.ReactNode;
  title: string;
  description: React.ReactNode;
  Toolbar?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  EmptyComponent?: React.ReactNode;
  Breadcrumb?: React.ReactNode;
  children?: React.ReactNode;
  [x: string]: any;
}

export default function MainPage({
  HeaderSection,
  HeaderButton,
  title,
  description,
  loading,
  empty,
  Toolbar,
  EmptyComponent,
  Breadcrumb,
  children = "",
  ...props
}: PageProps) {
  useTitle(`DCI > ${title}`);
  return (
    <div {...props}>
      {Breadcrumb && <PageSection>{Breadcrumb}</PageSection>}
      {HeaderSection === undefined ? (
        <PageSection>
          <Content component="h1">{title}</Content>
          <Content component="p">{description}</Content>
          {HeaderButton}
        </PageSection>
      ) : (
        HeaderSection
      )}
      <PageSection>
        {Toolbar}
        {loading ? (
          <Bullseye>
            <BlinkLogo />
          </Bullseye>
        ) : empty ? (
          <Bullseye>{EmptyComponent}</Bullseye>
        ) : (
          children
        )}
      </PageSection>
    </div>
  );
}
