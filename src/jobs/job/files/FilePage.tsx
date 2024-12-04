import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";
import { useLazyGetFileContentQuery } from "./filesApi";
import { EmptyState } from "ui";
import { IFile } from "types";

export default function FilePage() {
  const { file_id } = useParams();
  const [getFileContent, { data: fileContent, isLoading }] =
    useLazyGetFileContentQuery();

  useEffect(() => {
    if (file_id) {
      getFileContent({ id: file_id } as IFile);
    }
  }, [file_id, getFileContent]);

  if (!file_id) {
    return null;
  }

  if (isLoading) {
    return (
      <PageSection hasBodyWrapper={false}>
        <p>loading...</p>
      </PageSection>
    );
  }

  if (!fileContent) {
    return (
      <PageSection hasBodyWrapper={false}>
        <EmptyState
          title={`There is no file ${file_id}`}
          info="Add some jobs to see some info for this topic"
        />
      </PageSection>
    );
  }

  return (
    <PageSection hasBodyWrapper={false}>
      <pre style={{ fontSize: "0.8rem" }}>{fileContent}</pre>
    </PageSection>
  );
}
