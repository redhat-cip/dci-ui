import * as React from "react";
import { isEmpty } from "lodash";
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
  loading?: boolean;
  empty?: boolean;
  EmptyComponent?: React.ReactNode;
  Breadcrumb?: React.ReactNode;
  children: React.ReactNode;
  [x: string]: any;
}

export default function MainPage({
  HeaderSection,
  HeaderButton,
  title,
  description,
  loading,
  empty,
  EmptyComponent,
  Breadcrumb,
  children,
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
      {loading ? (
        <PageSection
          variant={PageSectionVariants.default}
          style={{ height: "80vh" }}
          isFilled={true}
        >
          <Bullseye>
            <BlinkLogo />
          </Bullseye>
        </PageSection>
      ) : null}

      {!loading && empty ? (
        <PageSection variant={PageSectionVariants.light}>
          <Bullseye>{EmptyComponent}</Bullseye>
        </PageSection>
      ) : null}

      {!loading && !empty ? (
        <PageSection variant={PageSectionVariants.default}>
          {children}
        </PageSection>
      ) : null}
    </div>
  );
}
