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
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { t_global_border_color_default } from "@patternfly/react-tokens";
import { DateTime } from "luxon";
import { formatDate } from "services/date";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { IJobStatus } from "types";
import { ComponentsList } from "jobs/components";
import { notEmpty } from "services/utils";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { JobStatusLabel } from "jobs/components";
import {
  extractPipelinesFromAnalyticsJobs,
  IPipelineDay,
  IPipelineJob,
  useLazyGetAnalyticJobsQuery,
} from "./pipelinesApi";
import { FilterIcon } from "@patternfly/react-icons";
import {
  humanizeJobDuration,
  JobComment,
  JobResults,
} from "analytics/jobs/JobComponents";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";

function jobStatusToVariant(status: IJobStatus) {
  switch (status) {
    case "new":
    case "pre-run":
    case "post-run":
      return "info";
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
              <Th style={{ minWidth: "250px" }}>name</Th>
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
                  <Td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    <ProgressStepper isCompact>
                      {pipeline.jobs.map((job) => (
                        <ProgressStep
                          key={job.id}
                          variant={jobStatusToVariant(job.status)}
                          id={job.name}
                          titleId={job.name}
                        />
                      ))}
                    </ProgressStepper>
                  </Td>
                  <Td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    <Truncate content={pipeline.name} />
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
  pipelinesPerDays,
}: {
  pipelinesPerDays: IPipelineDay[];
}) {
  if (pipelinesPerDays.length === 0) {
    return (
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <EmptyState
            variant={EmptyStateVariant.xs}
            icon={FilterIcon}
            titleText="No pipeline"
            headingLevel="h4"
          >
            <EmptyStateBody>
              We did not find any pipelines matching this search. Please modify
              your search.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {pipelinesPerDays.map((day, index) => (
        <PipelineCard key={index} pipelineDay={day} className="pf-v6-u-mt-md" />
      ))}
    </div>
  );
}

export default function PipelinesPage() {
  const [getAnalyticJobs, { data, isLoading }] = useLazyGetAnalyticJobsQuery();

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
        onLoad={({ query, after, before }) => {
          if (query !== "" && after !== "" && before !== "") {
            getAnalyticJobs({ query, after, before });
          }
        }}
        onSearch={({ query, after, before }) => {
          getAnalyticJobs({ query, after, before });
        }}
        isLoading={isLoading}
        data={data}
      />
      {data && (
        <PipelinesPerDay
          pipelinesPerDays={extractPipelinesFromAnalyticsJobs(data)}
        />
      )}
    </PageSection>
  );
}
