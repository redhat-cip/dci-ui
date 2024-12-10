import { ReactNode } from "react";
import {
  CodeBlock,
  CodeBlockCode,
  Modal,
  ModalBody,
  ModalHeader,
} from "@patternfly/react-core";
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
        isOpen={isOpen}
        onClose={hide}
        variant="large"
      >
        <ModalHeader title={file.name} />
        <ModalBody className="pf-v6-u-py-md">
          <CodeBlock>
            <CodeBlockCode>
              <FileContent file={file} />
            </CodeBlockCode>
          </CodeBlock>
        </ModalBody>
      </Modal>
      {children(show)}
    </>
  );
}
