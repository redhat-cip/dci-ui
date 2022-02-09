import MainPage from "pages/MainPage";
import {
  Card,
  Gallery,
  GalleryItem,
  CardBody,
  CardHeader,
  CardHeaderMain,
  CardTitle,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { useNavigate } from "react-router-dom";
import TasksPerJobHeaderImage from "./TasksDurationPerJob/tasks_per_job.png";
import ComponentCoverageImage from "./ComponentCoverage/component_coverage.png";
import LatestJobsStatusHeaderImage from "./LatestJobStatus/latest_jos_status.png";
import { useAuth } from "auth/authContext";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { identity } = useAuth();

  return (
    <MainPage
      title="Analytics"
      description="DCI Analytics is a service offered by DCI that helps you understand your data."
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Analytics" }]}
        />
      }
    >
      <Gallery hasGutter>
        {identity?.hasReadOnlyRole && (
          <GalleryItem>
            <Card
              className="pointer"
              onClick={() => navigate("/analytics/component_coverage")}
            >
              <CardHeader>
                <CardHeaderMain>
                  <img
                    src={ComponentCoverageImage}
                    alt="Component coverage"
                    height={100}
                    width="auto"
                  />
                </CardHeaderMain>
              </CardHeader>
              <CardTitle>Component coverage</CardTitle>
              <CardBody>
                See which components has been tested. Table of components and
                associated jobs.
              </CardBody>
            </Card>
          </GalleryItem>
        )}
        <GalleryItem>
          <Card
            className="pointer"
            onClick={() => navigate("/analytics/tasks_duration_per_job")}
          >
            <CardHeader>
              <CardHeaderMain>
                <img
                  src={TasksPerJobHeaderImage}
                  alt="Task per job header"
                  height={100}
                  width="auto"
                />
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>Tasks duration per job</CardTitle>
            <CardBody>
              For each remoteci compare the evolution of the duration of Ansible
              tasks per job. This analysis is useful for detecting possible
              problems in your continuous integration, or your agents.
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
                <img
                  src={LatestJobsStatusHeaderImage}
                  alt="Task per job header"
                  height={100}
                  width="auto"
                />
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>Latest Job status</CardTitle>
            <CardBody>
              See the latest jobs status per topic and per remoteci
            </CardBody>
          </Card>
        </GalleryItem>
      </Gallery>
    </MainPage>
  );
}