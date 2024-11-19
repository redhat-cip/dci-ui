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
import { Tr, Td } from "@patternfly/react-table";

interface FileProps {
  file: IFile;
}

export default function File({ file }: FileProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const isText = isATextFile(file);
  return (
    <Tr>
      <Td>
        {isText ? (
          <SeeFileContentModal file={file}>
            {(show) => (
              <Button variant="link" className="pf-v6-u-p-0" onClick={show}>
                {file.name}
              </Button>
            )}
          </SeeFileContentModal>
        ) : (
          file.name
        )}
      </Td>
      <Td>{humanFileSize(file.size)}</Td>
      <Td>{file.mime}</Td>
      <Td className="text-center">
        <Button
          size="sm"
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
          className="pf-v6-u-mr-xs"
          isDisabled={isDownloading}
        >
          download
        </Button>
        <Button
          size="sm"
          variant="secondary"
          icon={<ExternalLinkAltIcon />}
          className="pf-v6-u-mr-xs"
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
              size="sm"
              variant="secondary"
              icon={<EyeIcon />}
              onClick={show}
              isDisabled={!isText}
            >
              see
            </Button>
          )}
        </SeeFileContentModal>
      </Td>
    </Tr>
  );
}
