import { Button, PageSection, Content } from "@patternfly/react-core";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import { ConfirmDeleteModal } from "ui";
import { useNavigate } from "react-router-dom";
import { useJob } from "../jobContext";
import { useDeleteJobMutation } from "jobs/jobsApi";

export default function JobSettingsPage() {
  const navigate = useNavigate();
  const [deleteJob] = useDeleteJobMutation();
  const { job } = useJob();

  return (
    <PageSection>
      <Content
        component="h2"
        style={{ color: t_global_color_status_danger_default.value }}
      >
        Delete this job
      </Content>
      <Content
        component="p"
        style={{ color: t_global_color_status_danger_default.value }}
      >
        Once you delete a job, there is no going back. Please be certain.
      </Content>
      <ConfirmDeleteModal
        title="Delete Job"
        message="Are you sure you want to delete this job?"
        onOk={() => deleteJob(job).then(() => navigate("/jobs"))}
      >
        {(openModal) => (
          <Button variant="danger" onClick={openModal}>
            Delete this job
          </Button>
        )}
      </ConfirmDeleteModal>
    </PageSection>
  );
}
