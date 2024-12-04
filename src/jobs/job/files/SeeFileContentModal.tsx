import { ReactNode } from "react";
import { Modal } from "@patternfly/react-core/deprecated";
import { IFile } from "types";
import useModal from "hooks/useModal";
import FileContent from "./FileContent";

interface SeeFileContentModalProps {
  file: IFile;
  children: (open: () => void) => ReactNode;
}

export default function SeeFileContentModal({
  file,
  children,
}: SeeFileContentModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="file-content-viewer-modal"
        aria-label="File content viewer modal"
        title={file.name}
        isOpen={isOpen}
        onClose={hide}
        variant="large"
      >
        <FileContent file={file} />
      </Modal>
      {children(show)}
    </>
  );
}
