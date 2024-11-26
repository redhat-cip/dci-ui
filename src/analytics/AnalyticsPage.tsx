import {
  Card,
  Gallery,
  GalleryItem,
  CardBody,
  CardHeader,
  CardTitle,
  PageSection,
  Content,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { useNavigate } from "react-router-dom";
import TasksPerJobHeaderImage from "./TasksDurationPerJob/tasks_per_job.png";
import JunitComparisonHeaderImage from "./JunitComparison/junit_comparison.png";
import ComponentCoverageImage from "./ComponentCoverage/component_coverage.png";
import LatestJobsStatusHeaderImage from "./LatestJobStatus/latest_jos_status.png";
import PipelinesHeaderImages from "./Pipelines/pipelines.png";
import KeyValuesHeaderImages from "./KeyValues/keyvalues.png";
import { useAuth } from "auth/authSelectors";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (currentUser === null) return null;

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Analytics" }]} />
      <Content component="h1">Analytics</Content>
      <Content component="p">
        DCI Analytics is a service offered by DCI that helps you understand your
        data.
      </Content>
      <Gallery hasGutter>
        {currentUser.hasReadOnlyRole && (
          <GalleryItem>
            <Card
              className="pointer"
              onClick={() => {
                navigate("/analytics/keyvalues");
              }}
            >
              <CardHeader>
                <img
                  src={KeyValuesHeaderImages}
                  alt="Key values"
                  height={100}
                  width="auto"
                />
              </CardHeader>
              <CardTitle>Key values</CardTitle>
              <CardBody>Graph key values attached to your jobs</CardBody>
            </Card>
          </GalleryItem>
        )}
        <GalleryItem>
          <Card
            className="pointer"
            onClick={() => {
              navigate("/analytics/pipelines");
            }}
          >
            <CardHeader>
              <img
                src={PipelinesHeaderImages}
                alt="Pipelines"
                height={100}
                width="auto"
              />
            </CardHeader>
            <CardTitle>Pipelines</CardTitle>
            <CardBody>View pipelines from the past few days</CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card
            className="pointer"
            onClick={() => navigate("/analytics/component_coverage")}
          >
            <CardHeader>
              <img
                src={ComponentCoverageImage}
                alt="Component coverage"
                height={100}
                width="auto"
              />
            </CardHeader>
            <CardTitle>Component coverage</CardTitle>
            <CardBody>
              See which components has been tested. Table of components and
              associated jobs.
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card
            className="pointer"
            onClick={() => navigate("/analytics/junit_comparison")}
          >
            <CardHeader>
              <img
                src={JunitComparisonHeaderImage}
                alt="Junit comparison header"
                height={100}
                width="auto"
              />
            </CardHeader>
            <CardTitle>Junit comparison</CardTitle>
            <CardBody>
              Compare 2 topics togethers and see how your tests behave in term
              of performance.
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card
            className="pointer"
            onClick={() => navigate("/analytics/tasks_duration_per_job")}
          >
            <CardHeader>
              <img
                src={TasksPerJobHeaderImage}
                alt="Task per job header"
                height={100}
                width="auto"
              />
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
              <img
                src={LatestJobsStatusHeaderImage}
                alt="Task per job header"
                height={100}
                width="auto"
              />
            </CardHeader>
            <CardTitle>Latest Job status</CardTitle>
            <CardBody>
              See the latest jobs status per topic and per remoteci
            </CardBody>
          </Card>
        </GalleryItem>
      </Gallery>
    </PageSection>
  );
}
