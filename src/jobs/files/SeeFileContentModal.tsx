import React, { useState, useEffect, ReactNode } from "react";
import { Modal } from "@patternfly/react-core";
import { IFile } from "types";
import useModal from "hooks/useModal";
import { getFileContent } from "./filesActions";

interface SeeFileContentModalProps {
  file: IFile;
  children: (open: () => void) => ReactNode;
}

export default function SeeFileContentModal({
  file,
  children,
}: SeeFileContentModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getFileContent(file)
        .then((content) => {
          setFileContent(content);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [file, isOpen]);

  return (
    <>
      <Modal title={file.name} isOpen={isOpen} onClose={hide} variant="large">
        {isLoading ? (
          "loading...."
        ) : (
          <div
            className="p-md"
            style={{ fontSize: "0.7rem", overflow: "auto" }}
          >
            <pre>{fileContent}</pre>
          </div>
        )}
      </Modal>
      {children(show)}
    </>
  );
}
