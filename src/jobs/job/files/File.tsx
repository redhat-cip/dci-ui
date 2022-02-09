import { useState } from "react";
import FileSaver from "file-saver";
import { Button } from "@patternfly/react-core";
import { getFileContent } from "./filesActions";
import { humanFileSize, isATextFile } from "./filesGetters";
import {
  FileDownloadIcon,
  EyeIcon,
  ExternalLinkAltIcon,
} from "@patternfly/react-icons";
import { RotatingSpinnerIcon } from "ui";
import { IFile } from "types";
import { useNavigate } from "react-router-dom";
import SeeFileContentModal from "./SeeFileContentModal";

interface FileProps {
  file: IFile;
}

export default function File({ file }: FileProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const isText = isATextFile(file);
  return (
    <tr>
      <td>
        {isText ? (
          <SeeFileContentModal file={file}>
            {(show) => (
              <Button variant="link" className="p-0" onClick={show}>
                {file.name}
              </Button>
            )}
          </SeeFileContentModal>
        ) : (
          file.name
        )}
      </td>
      <td>{humanFileSize(file.size)}</td>
      <td>{file.mime}</td>
      <td className="text-center">
        <Button
          variant="primary"
          icon={isDownloading ? <RotatingSpinnerIcon /> : <FileDownloadIcon />}
          onClick={() => {
            setIsDownloading(true);
            getFileContent(file, { responseType: "blob" })
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
            navigate(`/files/${file.id}`);
          }}
        >
          link
        </Button>
        <SeeFileContentModal file={file}>
          {(show) => (
            <Button
              variant="secondary"
              icon={<EyeIcon />}
              onClick={show}
              isDisabled={!isText}
            >
              see
            </Button>
          )}
        </SeeFileContentModal>
      </td>
    </tr>
  );
}
