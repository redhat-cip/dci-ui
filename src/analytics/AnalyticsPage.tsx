import {
  Card,
  Gallery,
  CardBody,
  CardHeader,
  CardTitle,
  PageSection,
  Content,
  Label,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { useNavigate } from "react-router";
import TasksPerJobHeaderImage from "./TasksDurationPerJob/tasks_per_job.png";
import JunitComparisonHeaderImage from "./JunitComparison/junit_comparison.png";
import ComponentCoverageHeaderImage from "./ComponentCoverage/component_coverage.png";
import TestingTrendHeaderImage from "./TestingTrend/testing_trend.jpg";
import JobStatsHeaderImage from "./jobsStats/job_stats.png";
import PipelinesHeaderImage from "./Pipelines/pipelines.png";
import KeyValuesHeaderImage from "./KeyValues/keyvalues.png";
import DisplayIfBefore from "ui/DisplayIfBefore";

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Analytics" }]} />
      <Content component="h1">Analytics</Content>
      <Content component="p">
        DCI Analytics is a service offered by DCI that helps you understand your
        data.
      </Content>
      <Gallery
        hasGutter
        maxWidths={{
          default: "1fr",
        }}
      >
        <Card
          className="pointer"
          onClick={() => navigate("/analytics/testing_trend")}
        >
          <CardHeader>
            <img
              src={TestingTrendHeaderImage}
              alt="Testing trend"
              height={100}
              width="auto"
            />
          </CardHeader>
          <CardTitle>
            Testing Trend
            <DisplayIfBefore date="2025-08-01">
              <Label color="green" isCompact className="pf-v6-u-ml-xs">
                new
              </Label>
            </DisplayIfBefore>
          </CardTitle>
          <CardBody>See testing trend and detect flaky tests.</CardBody>
        </Card>
        <Card
          className="pointer"
          onClick={() => navigate("/analytics/job_stats")}
        >
          <CardHeader>
            <img
              src={JobStatsHeaderImage}
              alt="Job stats"
              height={100}
              width="auto"
            />
          </CardHeader>
          <CardTitle>
            Jobs stats
            <DisplayIfBefore date="2025-04-01">
              <Label color="green" isCompact className="pf-v6-u-ml-xs">
                new
              </Label>
            </DisplayIfBefore>
          </CardTitle>
          <CardBody>Build a statistical view of your jobs!</CardBody>
        </Card>
        <Card
          className="pointer"
          onClick={() => {
            navigate("/analytics/keyvalues");
          }}
        >
          <CardHeader>
            <img
              src={KeyValuesHeaderImage}
              alt="Key values"
              height={100}
              width="auto"
            />
          </CardHeader>
          <CardTitle>Key values</CardTitle>
          <CardBody>Graph key values attached to your jobs</CardBody>
        </Card>
        <Card
          className="pointer"
          onClick={() => {
            navigate("/analytics/pipelines");
          }}
        >
          <CardHeader>
            <img
              src={PipelinesHeaderImage}
              alt="Pipelines"
              height={100}
              width="auto"
            />
          </CardHeader>
          <CardTitle>Pipelines</CardTitle>
          <CardBody>View pipelines from the past few days</CardBody>
        </Card>
        <Card
          className="pointer"
          onClick={() => navigate("/analytics/component_coverage")}
        >
          <CardHeader>
            <img
              src={ComponentCoverageHeaderImage}
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
        <Card
          className="pointer"
          onClick={() => navigate("/analytics/junit_comparison")}
        >
          <CardHeader>
            <img
              src={JunitComparisonHeaderImage}
              alt="Junit comparison"
              height={100}
              width="auto"
            />
          </CardHeader>
          <CardTitle>Junit comparison</CardTitle>
          <CardBody>
            Compare 2 topics togethers and see how your tests behave in term of
            performance.
          </CardBody>
        </Card>
        <Card
          className="pointer"
          onClick={() => navigate("/analytics/tasks_duration_per_job")}
        >
          <CardHeader>
            <img
              src={TasksPerJobHeaderImage}
              alt="Task per job"
              height={100}
              width="auto"
            />
          </CardHeader>
          <CardTitle>Tasks duration per job</CardTitle>
          <CardBody>
            Compare the evolution of the duration of Ansible tasks per job.
          </CardBody>
        </Card>
      </Gallery>
    </PageSection>
  );
}
