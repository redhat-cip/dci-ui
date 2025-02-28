import { useState } from "react";
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Title,
  Divider,
  Label,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Button,
  Skeleton,
  Content,
  ContentVariants,
  PageSection,
  CardHeader,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb, CopyButton, StateLabel } from "ui";
import {
  IComponentCoverage,
  IComponentWithJobs,
  IJob,
  IJobStatus,
} from "types";
import { useParams, Link } from "react-router";
import { CalendarAltIcon, ClockIcon } from "@patternfly/react-icons";
import { fromNow, formatDate } from "services/date";
import { sortByNewestFirst } from "services/sort";
import { humanizeDuration } from "services/date";
import { getPercentageOfSuccessfulJobs } from "./stats";
import { JobStatusLabel } from "jobs/components";
import CardLine from "ui/CardLine";
import LastComponentsJobsBarChart from "analytics/ComponentCoverage/LastComponentsJobsBarChart";
import { DateTime } from "luxon";
import { useAuth } from "auth/authSelectors";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTeamQuery } from "teams/teamsApi";
import { useGetTopicQuery } from "topics/topicsApi";
import LoadingPageSection from "ui/LoadingPageSection";
import { useGetComponentQuery } from "components/componentsApi";
import TopicIcon from "topics/TopicIcon";
import StatHeaderCard from "./StatHeaderCard";

interface IComponentJobProps {
  job: IJob;
}

function ComponentJob({ job }: IComponentJobProps) {
  return (
    <div>
      <Grid hasGutter>
        <GridItem span={3}>
          <Link to={`/jobs/${job.id}/jobStates`}>{job.name || job.id}</Link>
        </GridItem>
        <GridItem span={2}>
          <JobStatusLabel status={job.status} />
        </GridItem>
        <GridItem span={3}>
          <div>
            {job.tags &&
              job.tags.map((tag, index) => (
                <Label
                  isCompact
                  key={index}
                  color="blue"
                  className="pf-v6-u-mr-xs pf-v6-u-mt-xs"
                >
                  <small>{tag}</small>
                </Label>
              ))}
          </div>
        </GridItem>
        <GridItem span={2}>
          <span title={`Duration in seconds ${job.duration}`}>
            <ClockIcon className="pf-v6-u-mr-xs" />
            {humanizeDuration(job.duration)}
          </span>
        </GridItem>
        <GridItem span={2}>
          <span title={`Created at ${job.created_at}`}>
            <CalendarAltIcon className="pf-v6-u-mr-xs" />
            {formatDate(job.created_at)}
          </span>
        </GridItem>
      </Grid>
    </div>
  );
}

function TopicLink({ topic_id }: { topic_id: string }) {
  const { data: topic, isLoading } = useGetTopicQuery(topic_id);

  if (isLoading) {
    return <Skeleton screenreaderText="Loading topic name" />;
  }

  if (!topic) return null;

  return (
    <Link to={`/topics/${topic.id}/components`}>
      <TopicIcon name={topic.name} className="pf-v6-u-mr-xs" />
      {topic.name}
    </Link>
  );
}

function ComponentDetails({ component }: { component: IComponentWithJobs }) {
  const [seeData, setSeeData] = useState(false);
  const { data: team } = useGetTeamQuery(
    component.team_id ? component.team_id : skipToken,
  );
  const { currentUser } = useAuth();
  const componentData = JSON.stringify(component.data, null, 2);

  return (
    <div>
      <Title headingLevel="h3" size="xl" className="pf-v6-u-p-md">
        Component information
      </Title>
      <Divider />
      <CardLine className="pf-v6-u-p-md" field="ID" value={component.id} />
      <Divider />
      <CardLine
        className="pf-v6-u-p-md"
        field="Name"
        value={component.display_name}
      />
      <Divider />
      <CardLine
        className="pf-v6-u-p-md"
        field="Version"
        value={component.version}
      />
      <Divider />
      {component.uid !== "" && (
        <>
          <CardLine
            className="pf-v6-u-p-md"
            field="Unique id"
            value={component.uid}
          />
          <Divider />
        </>
      )}
      <CardLine
        className="pf-v6-u-p-md"
        field="Topic"
        value={<TopicLink topic_id={component.topic_id} />}
      />
      <Divider />
      {currentUser?.hasReadOnlyRole && component.url !== "" && (
        <>
          <CardLine
            className="pf-v6-u-p-md"
            field="Url"
            value={
              <a href={component.url} target="_blank" rel="noopener noreferrer">
                {component.url}
              </a>
            }
          />
          <Divider />
        </>
      )}
      <CardLine className="pf-v6-u-p-md" field="Type" value={component.type} />
      <Divider />
      <CardLine
        className="pf-v6-u-p-md"
        field="Data"
        value={
          seeData ? (
            <Button
              onClick={() => setSeeData(false)}
              type="button"
              variant="tertiary"
            >
              hide content
            </Button>
          ) : (
            <Button
              onClick={() => setSeeData(true)}
              type="button"
              variant="tertiary"
            >
              see content
            </Button>
          )
        }
      />
      {team !== undefined && (
        <>
          <Divider />
          <CardLine
            className="pf-v6-u-p-md"
            field="Team"
            value={<Link to={`/teams/${team.id}`}>{team.name}</Link>}
          />
        </>
      )}
      {seeData && (
        <CodeBlock
          actions={[
            <CodeBlockAction>
              <CopyButton text={componentData} variant="plain" />
            </CodeBlockAction>,
          ]}
        >
          <CodeBlockCode id="component.data">{componentData}</CodeBlockCode>
        </CodeBlock>
      )}
      <Divider />
      <CardLine
        className="pf-v6-u-p-md"
        field="Tags"
        value={
          component.tags && component.tags.length > 0
            ? component.tags.map((tag, i) => (
                <Label
                  key={i}
                  className="pf-v6-u-mt-xs pf-v6-u-mr-xs"
                  color="blue"
                >
                  {tag}
                </Label>
              ))
            : "no tags"
        }
      />
      <Divider />
      <CardLine
        className="pf-v6-u-p-md"
        field="State"
        value={<StateLabel state={component.state} />}
      />
      <Divider />
      <CardLine
        className="pf-v6-u-p-md"
        field="Created"
        value={fromNow(component.created_at)}
      />
      <CardLine
        className="pf-v6-u-p-md"
        field="Release date"
        value={formatDate(component.released_at, DateTime.DATE_MED)}
      />
    </div>
  );
}

function convertComponentWithJobInComponentCoverage(
  component: IComponentWithJobs,
): IComponentCoverage {
  const jobsInfo = component.jobs.reduce(
    (acc, job) => {
      acc.jobs.push({
        id: job.id,
        created_at: job.created_at,
        status: job.status,
        name: job.name,
      });
      acc.nbOfJobs += 1;
      acc.nbOfSuccessfulJobs += job.status === "success" ? 1 : 0;
      return acc;
    },
    { nbOfSuccessfulJobs: 0, nbOfJobs: 0, jobs: [] } as {
      nbOfSuccessfulJobs: number;
      nbOfJobs: number;
      jobs: {
        id: string;
        created_at: string;
        status: IJobStatus;
        name: string;
      }[];
    },
  );
  return {
    id: component.id,
    display_name: component.display_name || "",
    type: component.type,
    topic_id: component.topic_id,
    tags: component.tags || [],
    ...jobsInfo,
  };
}

export default function ComponentPage() {
  const { topic_id, component_id } = useParams();

  const { data: component, isLoading } = useGetComponentQuery(
    component_id ? component_id : skipToken,
  );

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!component) {
    return (
      <EmptyState
        title="There is no component"
        info={`There is not component with id ${component_id}`}
      />
    );
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/topics", title: "Topics" },
          { to: `/topics/${topic_id}/components`, title: topic_id },
          { to: `/topics/${topic_id}/components`, title: "Components" },
          {
            to: `/topics/${topic_id}/components/${component_id}`,
            title: component_id,
          },
        ]}
      />
      <Content component="h1">{`Component ${component.display_name}`}</Content>
      <Content component="p">{`Details page for component ${component.display_name}`}</Content>
      <Grid hasGutter>
        <GridItem span={3}>
          <StatHeaderCard
            title={component.jobs.length.toString()}
            subTitle="Number of jobs"
          />
        </GridItem>
        <GridItem span={3}>
          <StatHeaderCard
            title={`${getPercentageOfSuccessfulJobs(component.jobs)}%`}
            subTitle="Percentage of successful jobs"
          />
        </GridItem>
        <GridItem span={3}>
          <StatHeaderCard
            title={
              component.jobs.length === 0
                ? "no job"
                : fromNow(component.jobs[0].created_at) || ""
            }
            subTitle="Latest run"
          />
        </GridItem>
        <GridItem span={3}>
          <Card>
            <CardBody style={{ paddingBottom: "8px" }}>
              <Content component={ContentVariants.h6}>Latest jobs</Content>
              <LastComponentsJobsBarChart
                component={convertComponentWithJobInComponentCoverage(
                  component,
                )}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <ComponentDetails key={component.etag} component={component} />
        </CardBody>
      </Card>

      <Card className="pf-v6-u-mt-md">
        <CardHeader title="Jobs" />
        <CardBody>
          <Grid hasGutter>
            <GridItem span={3}>Job name</GridItem>
            <GridItem span={2}>Status</GridItem>
            <GridItem span={3}>tags</GridItem>
            <GridItem span={2}>Duration</GridItem>
            <GridItem span={2}>Created At</GridItem>
          </Grid>
          {component.jobs.length === 0 ? (
            <div className="pf-v6-u-p-md">
              <Divider /> There is no job attached to this component
            </div>
          ) : (
            sortByNewestFirst(component.jobs).map((job, index) => (
              <div key={index}>
                <Divider />
                <div className="pf-v6-u-p-md">
                  <ComponentJob job={job} />
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </PageSection>
  );
}
