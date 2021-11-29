import { Page } from "layout";
import {
  Card,
  Gallery,
  GalleryItem,
  PageSection,
  CardBody,
  CardHeader,
  CardHeaderMain,
  CardTitle,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { useNavigate } from "react-router-dom";
import TasksPerJobHeaderImage from "./TasksDurationPerJob/tasks_per_job.png";
import LatestJobsStatusHeaderImage from "./LatestJobStatus/latest_jos_status.png";

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <Page
      title="Analytics"
      description="DCI Analytics is a service offered by DCI that helps you understand your data."
      breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Analytics" }]}
        />
      }
    >
      <PageSection>
        <Gallery hasGutter>
          <GalleryItem>
            <Card
              className="pointer"
              onClick={() => navigate("/analytics/tasks_duration_per_job")}
            >
              <CardHeader>
                <CardHeaderMain>
                  <img src={TasksPerJobHeaderImage} alt="Task per job header" height={100} width='auto' />
                </CardHeaderMain>
              </CardHeader>
              <CardTitle>Tasks duration per job</CardTitle>
              <CardBody>
                For each remoteci compare the evolution of the duration of
                Ansible tasks per job. This analysis is useful for detecting
                possible problems in your continuous integration, or your
                agents.
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card
              className="pointer"
              onClick={() => navigate("/analytics/latest_jobs_status")}
            >
              <CardHeader>
                <CardHeaderMain>
                  <img src={LatestJobsStatusHeaderImage} alt="Task per job header" height={100} width='auto' />
                </CardHeaderMain>
              </CardHeader>
              <CardTitle>Latest Job status</CardTitle>
              <CardBody>
                See the latest jobs status per topic and per remoteci
              </CardBody>
            </Card>
          </GalleryItem>
        </Gallery>
      </PageSection>
    </Page>
  );
}
