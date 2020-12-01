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

interface FileProps {
  file: IFile;
}

export default function File({ file }: FileProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <tr>
      <td>{file.name}</td>
      <td>{humanFileSize(file.size)}</td>
      <td>{file.mime}</td>
      <td className="text-center">
        <Button
          variant="primary"
          onClick={() => {
            setIsDownloading(true);
            dispatch(getFileContent(file, { responseType: "blob" }))
              .then((response) => {
                const blob = new Blob([response.data], {
                  type: file.mime || undefined,
                });
                FileSaver.saveAs(blob, `${file.name}`);
                return response;
              })
              .finally(() => setIsDownloading(false));
          }}
          isDisabled={isDownloading}
        >
          {isDownloading ? <RotatingSpinnerIcon /> : <FileDownloadIcon />}
          download
        </Button>
      </td>
    </tr>
  );
}
