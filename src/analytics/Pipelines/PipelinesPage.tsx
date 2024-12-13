import {
  Button,
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  ProgressStep,
  ProgressStepper,
  CardHeader,
  Truncate,
  PageSection,
  Content,
  Skeleton,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { t_global_border_color_default } from "@patternfly/react-tokens";
import { DateTime } from "luxon";
import { formatDate } from "services/date";
import { Fragment, useState } from "react";
import { Link } from "react-router";
import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
  IJobStatus,
} from "types";
import { ComponentsList } from "jobs/components";
import { notEmpty } from "services/utils";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { JobStatusLabel } from "jobs/components";
import {
  extractPipelinesFromAnalyticsJobs,
  IPipelineDay,
  IPipelineJob,
} from "./pipelines";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  FilterIcon,
  InProgressIcon,
  ResourcesFullIcon,
} from "@patternfly/react-icons";
import {
  humanizeJobDuration,
  JobComment,
  JobResults,
} from "analytics/jobs/JobComponents";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";

function jobStatusToVariant(status: IJobStatus) {
  switch (status) {
    case "new":
    case "pre-run":
    case "post-run":
    case "running":
      return "pending";
    case "success":
      return "success";
    case "killed":
      return "warning";
    case "error":
    case "failure":
      return "danger";
    default:
      return "default";
  }
}

function jobStatusToProgressStepIcon(status: IJobStatus) {
  switch (status) {
    case "new":
    case "pre-run":
    case "post-run":
    case "running":
      return <InProgressIcon />;
    case "success":
      return <CheckCircleIcon />;
    case "killed":
      return <ExclamationTriangleIcon />;
    case "error":
    case "failure":
      return <ExclamationCircleIcon />;
    default:
      return <ResourcesFullIcon />;
  }
}

function PipelineJobInfo({ job, index }: { job: IPipelineJob; index: number }) {
  return (
    <>
      <Td
        style={{
          borderLeft:
            index === 0
              ? `1px solid ${t_global_border_color_default.var}`
              : "none",
          whiteSpace: "nowrap",
        }}
      >
        <Link to={`/jobs/${job.id}/jobStates`}>
          <JobStatusLabel
            status={job.status}
            className="pf-v6-u-mr-xs"
            style={{ zIndex: 1 }}
          />

          {job.name}
        </Link>
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        <JobComment comment={job.comment} status_reason={job.status_reason} />
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
        }}
      >
        <JobResults results={job.results} />
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
          textAlign: "center",
          borderRight: `1px solid ${t_global_border_color_default.var}`,
        }}
      >
        {humanizeJobDuration(job.duration)}
      </Td>
    </>
  );
}

function PipelineCard({
  pipelineDay,
  ...props
}: {
  pipelineDay: IPipelineDay;
  [k: string]: any;
}) {
  const [seeJobComponents, setSeeJobComponents] = useState(false);
  return (
    <Card {...props}>
      <CardHeader
        actions={{
          actions: (
            <Button
              type="button"
              variant="tertiary"
              onClick={() => {
                setSeeJobComponents(!seeJobComponents);
              }}
            >
              {seeJobComponents ? "Hide job components" : "See job components"}
            </Button>
          ),
          hasNoOffset: false,
          className: undefined,
        }}
      >
        <CardTitle>
          {formatDate(pipelineDay.datetime, DateTime.DATE_MED_WITH_WEEKDAY)}
        </CardTitle>
      </CardHeader>
      <CardBody style={{ overflow: "auto" }}>
        <Table>
          <Thead>
            <Tr>
              <Th>pipeline</Th>
              <Th style={{ minWidth: "250px" }}>pipeline name</Th>
              <Th colSpan={-1}>jobs</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pipelineDay.pipelines.map((pipeline, index) => (
              <Fragment key={index}>
                <Tr
                  style={{
                    borderTop: `1px solid ${t_global_border_color_default.var}`,
                  }}
                >
                  <Td rowSpan={seeJobComponents ? 2 : 1}>
                    <ProgressStepper isCompact>
                      {pipeline.jobs.map((job) => (
                        <ProgressStep
                          key={job.id}
                          variant={jobStatusToVariant(job.status)}
                          id={job.name}
                          titleId={job.name}
                          icon={jobStatusToProgressStepIcon(job.status)}
                        />
                      ))}
                    </ProgressStepper>
                  </Td>
                  <Td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    <Link to={`/jobs?where=pipeline_id:${pipeline.id}`}>
                      <Truncate content={pipeline.name} />
                    </Link>
                  </Td>
                  {pipeline.jobs.map((job, index) => (
                    <PipelineJobInfo key={index} index={index} job={job} />
                  ))}
                </Tr>
                {seeJobComponents && (
                  <Tr>
                    {pipeline.jobs.map((job) => (
                      <Td
                        style={{
                          borderLeft: `1px solid ${t_global_border_color_default.value}`,
                          whiteSpace: "nowrap",
                        }}
                        colSpan={4}
                      >
                        <ComponentsList
                          components={job.components.filter(notEmpty)}
                        />
                      </Td>
                    ))}
                  </Tr>
                )}
              </Fragment>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

function PipelinesPerDay({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse | undefined;
  [k: string]: any;
}) {
  if (isLoading) {
    return (
      <Card {...props}>
        <CardBody>
          <Skeleton
            screenreaderText="Loading analytics jobs"
            style={{ height: 80 }}
          />
        </CardBody>
      </Card>
    );
  }
  if (!data || !data.hits) {
    return null;
  }
  const pipelinesPerDays = extractPipelinesFromAnalyticsJobs(data);
  if (pipelinesPerDays.length === 0) {
    return (
      <Card {...props}>
        <CardBody>
          <EmptyState
            variant={EmptyStateVariant.xs}
            icon={FilterIcon}
            titleText="No job"
            headingLevel="h4"
          >
            <EmptyStateBody>
              We did not find any jobs matching this search. Please modify your
              search.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }
  return (
    <div>
      {pipelinesPerDays.map((day, index) => (
        <PipelineCard key={index} pipelineDay={day} {...props} />
      ))}
    </div>
  );
}

export default function PipelinesPage() {
  const [getAnalyticJobs, { data, isLoading, isFetching }] =
    useLazyGetAnalyticJobsQuery();

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Pipelines" },
        ]}
      />
      <Content component="h1">Pipelines</Content>
      <AnalyticsToolbar
        isLoading={isFetching}
        data={data}
        onLoad={({ query, after, before }) => {
          if (query !== "" && after !== "" && before !== "") {
            getAnalyticJobs({ query, after, before });
          }
        }}
        onSearch={({ query, after, before }) => {
          getAnalyticJobs({ query, after, before });
        }}
      />
      <PipelinesPerDay
        isLoading={isLoading}
        data={data}
        className="pf-v6-u-mt-md"
      />
    </PageSection>
  );
}
