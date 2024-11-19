import { PageSection } from "@patternfly/react-core";
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
        hasBodyWrapper={false}
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
