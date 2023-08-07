import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import {
  Button,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import styled from "styled-components";
import { global_danger_color_100 } from "@patternfly/react-tokens";
import { ConfirmDeleteModal } from "ui";
import jobsActions from "jobs/jobsActions";
import { useNavigate } from "react-router-dom";
import { useJob } from "../jobContext";

const DangerZone = styled.div`
  border: 1px solid ${global_danger_color_100.value};
  padding: 1rem;
  border-radius: 0.5rem;
`;

const DangerZoneRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function JobSettingsPage() {
  const { job } = useJob();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  return (
    <PageSection variant={PageSectionVariants.light}>
      <TextContent>
        <Text component="h1">Danger Zone</Text>
      </TextContent>
      <DangerZone className="pf-v5-u-mt-md">
        <DangerZoneRow>
          <div>
            <TextContent>
              <Text component="h2">Delete this job</Text>
              <Text component="p">
                Once you delete a job, there is no going back. Please be
                certain.
              </Text>
            </TextContent>
          </div>
          <div>
            <ConfirmDeleteModal
              title="Delete Job"
              message="Are you sure you want to delete this job?"
              onOk={() =>
                dispatch(jobsActions.delete(job)).then(() => navigate("/jobs"))
              }
            >
              {(openModal) => (
                <Button variant="danger" onClick={openModal}>
                  Delete this job
                </Button>
              )}
            </ConfirmDeleteModal>
          </div>
        </DangerZoneRow>
      </DangerZone>
    </PageSection>
  );
}
