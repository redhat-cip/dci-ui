import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFileContent } from "jobs/files/filesActions";
import { IFile } from "types";
import pages from "pages";

interface MatchParams {
  id: string;
}

export default function FilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<MatchParams>();
  const [fileContent, setFileContent] = useState<string | null>(null);
  useEffect(() => {
    getFileContent({ id } as IFile)
      .then((content) => {
        setFileContent(content);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <pages.NotAuthenticatedLoadingPage />;
  }
  if (fileContent === null) return null;
  return (
    <div className="p-md" style={{ fontSize: "0.8rem" }}>
      <pre>{fileContent}</pre>
    </div>
  );
}
