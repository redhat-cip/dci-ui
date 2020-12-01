import React, { useState, useEffect } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { EyeIcon } from "@patternfly/react-icons";
import { IFile } from "types";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import useModal from "hooks/useModal";
import { getFileContent } from "./filesActions";

interface SeeFileContentModalProps {
  file: IFile;
}

export default function SeeFileContentModal({
  file,
}: SeeFileContentModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isOpen) {
      dispatch(getFileContent(file))
        .then((response) => {
          setFileContent(response.data);
        })
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, file, isOpen]);

  return (
    <>
      <Modal title={file.name} isOpen={isOpen} onClose={hide} variant="large">
        {isLoading ? (
          "loading...."
        ) : (
          <div className="p-md" style={{ fontSize: "0.7rem" }}>
            <pre>{fileContent}</pre>
          </div>
        )}
      </Modal>
      <Button variant="secondary" icon={<EyeIcon />} onClick={show}>
        see
      </Button>
    </>
  );
}
