import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFileContent } from "jobs/job/files/filesActions";
import { IFile } from "types";
import { PageSection } from "@patternfly/react-core";

export default function FilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const { file_id } = useParams();

  useEffect(() => {
    if (file_id) {
      getFileContent({ id: file_id } as IFile)
        .then((content) => {
          setFileContent(content);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [file_id]);

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

  if (!isLoading && fileContent === null) {
    return (
      <PageSection hasBodyWrapper={false}>
        <p>Something went wrong</p>
      </PageSection>
    );
  }

  return (
    <PageSection hasBodyWrapper={false}>
      <pre style={{ fontSize: "0.8rem" }}>{fileContent}</pre>
    </PageSection>
  );
}
