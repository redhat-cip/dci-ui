import * as React from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Bullseye,
  Text,
} from "@patternfly/react-core";
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
  children="",
  ...props
}: PageProps) {
  useTitle(`DCI > ${title}`);
  return (
    <div {...props}>
      {Breadcrumb && (
        <section className="pf-v5-c-page__main-breadcrumb">
          {Breadcrumb}
        </section>
      )}
      {HeaderSection === undefined ? (
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
      <PageSection variant={PageSectionVariants.default} isFilled={true}>
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
