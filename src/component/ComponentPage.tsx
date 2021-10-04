import { useEffect, useState, useCallback } from "react";
import * as React from "react";
import { Page } from "layout";
import {
  PageSection,
  Card,
  CardBody,
  Grid,
  GridItem,
  Title,
  Divider,
  Tooltip,
  Label,
} from "@patternfly/react-core";
import {
  global_Color_400,
  global_success_color_100,
  global_danger_color_100,
  global_warning_color_100,
  global_active_color_100,
} from "@patternfly/react-tokens";
import { EmptyState, Breadcrumb } from "ui";
import { IComponentWithJobs, IEmbedJob } from "types";
import { useParams, Link } from "react-router-dom";
import { fetchComponent } from "./componentActions";
import styled from "styled-components";
import { Markup } from "interweave";
import { convertLinksToHtml } from "jobs/comment";
import {
  InfoCircleIcon,
  CalendarAltIcon,
  ClockIcon,
} from "@patternfly/react-icons";
import { fromNow, formatDate } from "services/date";
import { sortByNewestFirst } from "services/sort";
import { humanizeDuration } from "services/date";
import { StatHeaderCard } from "analytics/LatestJobStatus/LatestJobStatusDetailsPage";
import { getPercentageOfSuccessfulJobs } from "./stats";

const Padding = styled.div`
  padding: 1em;
`;

const Field = styled.span`
  color: #72767b;
  font-weight: bold;
`;

interface LineProps {
  field: string;
  help?: string;
  value: React.ReactNode;
}

function Line({ field, help, value }: LineProps) {
  return (
    <Grid hasGutter>
      <GridItem span={4}>
        <div>
          <Field>
            {field}
            {help && (
              <Tooltip position="right" content={<div>{help}</div>}>
                <span className="ml-xs">
                  <InfoCircleIcon />
                </span>
              </Tooltip>
            )}
          </Field>
        </div>
      </GridItem>
      <GridItem span={8}>{value}</GridItem>
    </Grid>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "success":
      return global_success_color_100.value;
    case "failure":
    case "error":
      return global_danger_color_100.value;
    case "killed":
      return global_warning_color_100.value;
    default:
      return global_active_color_100.value;
  }
}

const StatusColor = styled.div`
  color: ${(props: { status: string }) => getStatusColor(props.status)};
`;

interface IEmbedJobProps {
  job: IEmbedJob;
}

function EmbedJob({ job }: IEmbedJobProps) {
  return (
    <div>
      <Grid hasGutter>
        <GridItem span={3}>
          <Link to={`/jobs/${job.id}/jobStates`}>{job.id}</Link>
        </GridItem>
        <GridItem span={3}>
          <StatusColor status={job.status}>{job.status}</StatusColor>
        </GridItem>
        <GridItem span={3}>
          <span title={`Duration in seconds ${job.duration}`}>
            <ClockIcon className="mr-xs" />
            {humanizeDuration(job.duration * 1000)}
          </span>
        </GridItem>
        <GridItem span={3}>
          <span title={`Created at ${job.created_at}`}>
            <CalendarAltIcon className="mr-xs" />
            {formatDate(job.created_at)}
          </span>
        </GridItem>
      </Grid>
      {job.comment && (
        <Grid hasGutter className="mt-sm">
          <GridItem span={12}>
            <div>
              <span style={{ color: global_Color_400.value }}>
                <Markup content={convertLinksToHtml(job.comment)} />
              </span>
            </div>
          </GridItem>
        </Grid>
      )}
      <Grid hasGutter className="mt-sm">
        <GridItem span={12}>
          <div>
            {job.tags &&
              job.tags.map((tag, index) => (
                <Label key={index} color="blue" className="mr-xs mt-xs">
                  <small>{tag}</small>
                </Label>
              ))}
          </div>
        </GridItem>
      </Grid>
    </div>
  );
}

export default function ComponentPage() {
  const { topic_id, id } = useParams();
  const [isFetching, setIsFetching] = useState(true);
  const [component, setComponent] = useState<IComponentWithJobs | null>(null);

  const getComponentCallback = useCallback(() => {
    if (id) {
      fetchComponent(id)
        .then((response) => setComponent(response.data.component))
        .finally(() => setIsFetching(false));
    }
  }, [id, setIsFetching]);

  useEffect(() => {
    getComponentCallback();
  }, [getComponentCallback]);

  if (!id || !topic_id) return null;

  return (
    <Page
      title={
        component
          ? `Component ${component.canonical_project_name}`
          : "Component"
      }
      loading={isFetching && component === null}
      empty={!isFetching && component === null}
      description={
        component
          ? `Details page for component ${component.canonical_project_name}`
          : "Details page"
      }
      EmptyComponent={
        <EmptyState
          title="There is no component"
          info={`There is not component with id ${id}`}
        />
      }
      breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/topics", title: "Topics" },
            { to: `/topics/${topic_id}/components`, title: topic_id },
            { to: `/topics/${topic_id}/components`, title: "Components" },
            { to: `/topics/${topic_id}/components/${id}`, title: id },
          ]}
        />
      }
    >
      <PageSection>
        {component === null ? null : (
          <>
            <Card>
              <CardBody>
                <Padding>
                  <Title headingLevel="h3" size="xl">
                    Component information
                  </Title>
                </Padding>
                <Divider />
                <Padding>
                  <Line field="ID" value={component.id} />
                </Padding>
                <Divider />
                <Padding>
                  <Line field="Name" value={component.canonical_project_name} />
                </Padding>
                <Divider />
                <Padding>
                  <Line field="Unique Name" value={component.name} />
                </Padding>
                <Divider />
                <Padding>
                  <Line
                    field="Topic id"
                    value={
                      <Link to={`/topics/${component.topic_id}/components`}>
                        {component.topic_id}
                      </Link>
                    }
                  />
                </Padding>
                <Divider />
                <Padding>
                  <Line field="Type" value={component.type} />
                </Padding>
                <Divider />
                <Padding>
                  <Line
                    field="Tags"
                    value={
                      component.tags && component.tags.length > 0
                        ? component.tags.map((tag, i) => (
                            <Label key={i} className="mt-xs mr-xs" color="blue">
                              {tag}
                            </Label>
                          ))
                        : "no tags"
                    }
                  />
                </Padding>
                <Divider />
                <Padding>
                  <Line field="State" value={component.state} />
                </Padding>
                <Divider />
                <Padding>
                  <Line field="Created" value={fromNow(component.created_at)} />
                </Padding>
              </CardBody>
            </Card>

            {component.jobs.length === 0 ? null : (
              <Grid hasGutter className="mt-md">
                <GridItem span={4}>
                  <StatHeaderCard
                    title={component.jobs.length.toString()}
                    subTitle="Number of jobs"
                  />
                </GridItem>
                <GridItem span={4}>
                  <StatHeaderCard
                    title={`${getPercentageOfSuccessfulJobs(component.jobs)}%`}
                    subTitle="Percentage of successful jobs"
                  />
                </GridItem>
                <GridItem span={4}>
                  <StatHeaderCard
                    title={fromNow(component.jobs[0].created_at) || ""}
                    subTitle="Latest run"
                  />
                </GridItem>
              </Grid>
            )}

            <Card className="mt-md">
              <CardBody>
                <Padding>
                  <Title headingLevel="h3" size="xl">
                    Jobs
                  </Title>
                </Padding>
                <div>
                  <Divider />
                  <Padding>
                    <Grid hasGutter>
                      <GridItem span={3}>
                        <b>Job Id</b>
                      </GridItem>
                      <GridItem span={3}>
                        <b>Status</b>
                      </GridItem>
                      <GridItem span={3}>
                        <b>Duration</b>
                      </GridItem>
                      <GridItem span={3}>
                        <b>Created At</b>
                      </GridItem>
                    </Grid>
                  </Padding>
                </div>
                {component.jobs.length === 0 ? (
                  <div>
                    <Divider />
                    <Padding>
                      There is no job attached to this component
                    </Padding>
                  </div>
                ) : (
                  sortByNewestFirst(component.jobs).map((j) => (
                    <div>
                      <Divider />
                      <Padding>
                        <EmbedJob job={j} />
                      </Padding>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </>
        )}
      </PageSection>
    </Page>
  );
}
