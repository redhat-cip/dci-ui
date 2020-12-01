import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useParams } from "react-router-dom";
import { AppDispatch } from "store";
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
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getFileContent({ id } as IFile))
      .then((response) => {
        setFileContent(response.data);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch, id]);

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
