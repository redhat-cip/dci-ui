import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import React from "react";

interface JobDetailsSkeletonProps {
  children: React.ReactNode;
}

export default function JobDetailsSkeleton({
  children,
}: JobDetailsSkeletonProps) {
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        style={{
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {children}
      </PageSection>
    </>
  );
}
