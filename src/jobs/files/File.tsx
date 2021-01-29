import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FileSaver from "file-saver";
import { Button } from "@patternfly/react-core";
import { getFileContent } from "./filesActions";
import { humanFileSize } from "./filesGetters";
import {
  FileDownloadIcon,
  EyeIcon,
  ExternalLinkAltIcon,
} from "@patternfly/react-icons";
import { RotatingSpinnerIcon } from "ui";
import { IFile } from "types";
import { AppDispatch } from "store";
import { useHistory } from "react-router-dom";
import SeeFileContentModal from "./SeeFileContentModal";

interface FileProps {
  file: IFile;
}

export default function File({ file }: FileProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const textMimeTypes = [
    "text/plain",
    "application/junit",
    "text/css",
    "text/csv",
    "text/html",
    "text/xml",
    "text/calendar",
    "application/json",
    "text/javascript",
    "image/svg+xml",
    "application/xhtml+xml",
  ];
  return (
    <tr>
      <td>
        <SeeFileContentModal file={file}>
          {(show) => (
            <Button variant="link" className="p-0" onClick={show}>
              {file.name}
            </Button>
          )}
        </SeeFileContentModal>
      </td>
      <td>{humanFileSize(file.size)}</td>
      <td>{file.mime}</td>
      <td className="text-center">
        <Button
          variant="primary"
          icon={isDownloading ? <RotatingSpinnerIcon /> : <FileDownloadIcon />}
          onClick={() => {
            setIsDownloading(true);
            dispatch(getFileContent(file, { responseType: "blob" }))
              .then((content) => {
                const blob = new Blob([content], {
                  type: file.mime || undefined,
                });
                FileSaver.saveAs(blob, `${file.name}`);
              })
              .catch(console.error)
              .finally(() => setIsDownloading(false));
          }}
          className="mr-xs"
          isDisabled={isDownloading}
        >
          download
        </Button>
        <Button
          variant="secondary"
          icon={<ExternalLinkAltIcon />}
          className="mr-xs"
          iconPosition="right"
          onClick={() => {
            history.push(`/files/${file.id}`);
          }}
        >
          link
        </Button>
        {file.mime === null ||
        textMimeTypes.indexOf(file.mime) === -1 ? null : (
          <SeeFileContentModal file={file}>
            {(show) => (
              <Button variant="secondary" icon={<EyeIcon />} onClick={show}>
                see
              </Button>
            )}
          </SeeFileContentModal>
        )}
      </td>
    </tr>
  );
}
