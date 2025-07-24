import { Button, Modal, ModalHeader, ModalBody } from "@patternfly/react-core";

import type { IAnalyticsJob } from "types";
import useModal from "hooks/useModal";
import AnalyticsJobTable from "analytics/jobs/AnalyticsJobTable";

export default function AnalyticsJobsModal<T extends IAnalyticsJob>({
  jobs,
  className,
}: {
  jobs: T[];
  className?: string;
}) {
  const { isOpen, show, hide } = useModal(false);

  return (
    <>
      <Button variant="link" isInline onClick={show} className={className}>
        See the {jobs.length} job{jobs.length > 1 ? "s" : ""}
      </Button>
      <Modal
        id="jobs-list-modal"
        aria-label="Analytics jobs list"
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Jobs list" />
        <ModalBody>
          <AnalyticsJobTable jobs={jobs} />
        </ModalBody>
      </Modal>
    </>
  );
}
