import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FileSaver from "file-saver";
import { Button } from "@patternfly/react-core";
import { getFileContent } from "./filesActions";
import { humanFileSize } from "./filesGetters";
import { FileDownloadIcon } from "@patternfly/react-icons";
import { RotatingSpinnerIcon } from "ui";
import { IFile } from "types";
import { AppDispatch } from "store";
import { Link } from "react-router-dom";
import SeeFileContentModal from "./SeeFileContentModal";

interface FileProps {
  file: IFile;
}

export default function File({ file }: FileProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const textMimeTypes = [
    "text/plain",
    "application/junit",
    "text/css",
    "text/csv",
    "text/html",
    "text/calendar",
    "application/json",
    "text/javascript",
    "image/svg+xml",
    "application/xhtml+xml",
  ];
  return (
    <tr>
      <td>
        <Link to={`/files/${file.id}`}>{file.name}</Link>
      </td>
      <td>{humanFileSize(file.size)}</td>
      <td>{file.mime}</td>
      <td className="text-left">
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
        {file.mime === null ||
        textMimeTypes.indexOf(file.mime) === -1 ? null : (
          <SeeFileContentModal file={file} />
        )}
      </td>
    </tr>
  );
}
