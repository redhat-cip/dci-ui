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
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
} from "@patternfly/react-core";
import { Breadcrumb, CopyButton, StateLabel } from "ui";
import type {
  IComponent,
  IComponentCoverage,
  IComponentWithJobs,
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
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";

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

function ComponentDetails({
  component,
  className,
}: {
  component: IComponentWithJobs;
  className?: string;
}) {
  const [seeData, setSeeData] = useState(false);
  const { data: team } = useGetTeamQuery(
    component.team_id ? component.team_id : skipToken,
  );
  const { currentUser } = useAuth();
  const componentData = JSON.stringify(component.data, null, 2);

  return (
    <Card className={className}>
      <CardBody>
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
                <a
                  href={component.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {component.url}
                </a>
              }
            />
            <Divider />
          </>
        )}
        <CardLine
          className="pf-v6-u-p-md"
          field="Type"
          value={component.type}
        />
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
        {seeData && (
          <>
            <CodeBlock
              actions={[
                <CodeBlockAction key="copyButton">
                  <CopyButton text={componentData} variant="plain" />
                </CodeBlockAction>,
              ]}
            >
              <CodeBlockCode id="component.data">{componentData}</CodeBlockCode>
            </CodeBlock>
          </>
        )}
        <Divider />
        {team !== undefined && (
          <>
            <CardLine
              className="pf-v6-u-p-md"
              field="Team"
              value={<Link to={`/teams/${team.id}`}>{team.name}</Link>}
            />
            <Divider />
          </>
        )}
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
      </CardBody>
    </Card>
  );
}

function GetImageInstruction({ component }: { component: IComponent }) {
  const { data: topic, isLoading } = useGetTopicQuery(component.topic_id);

  if (isLoading) {
    return <Skeleton screenreaderText="Loading get this image instruction" />;
  }

  if (!topic) return null;

  const getThisImageTxt = `dcictl download-pull-secret --topic ${topic.name} --destination /tmp/auth.json
podman pull --authfile /tmp/auth.json ${component.url}:${component.version}`;

  return (
    <CodeBlock>
      <CodeBlockCode id="getThisImage">{getThisImageTxt}</CodeBlockCode>
    </CodeBlock>
  );
}

function ContainerComponent({
  component,
  className,
}: {
  component: IComponent;
  className?: string;
}) {
  const { data: team } = useGetTeamQuery(
    component.team_id ? component.team_id : skipToken,
  );

  return (
    <>
      <Card className={className}>
        <CardBody>
          <Title headingLevel="h3" size="xl" className="pf-v6-u-p-md">
            Container information
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
            field="Url"
            value={component.url}
          />
          <Divider />
          <CardLine
            className="pf-v6-u-p-md"
            field="Container tag"
            value={component.version}
          />
          <Divider />
          {component.uid !== "" && (
            <>
              <CardLine
                className="pf-v6-u-p-md"
                field="Image Digest"
                value={component.uid}
              />
              <Divider />
            </>
          )}
          {team !== undefined && (
            <>
              <CardLine
                className="pf-v6-u-p-md"
                field="Team"
                value={<Link to={`/teams/${team.id}`}>{team.name}</Link>}
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
          <Divider />
          <CardLine
            className="pf-v6-u-p-md"
            field="Release date"
            value={formatDate(component.released_at, DateTime.DATE_MED)}
          />
        </CardBody>
      </Card>
      <Card className={className}>
        <CardBody>
          <Title headingLevel="h3" size="xl" className="pf-v6-u-p-md">
            Get this image
          </Title>
          <GetImageInstruction component={component} />
        </CardBody>
      </Card>
    </>
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
  const { component_id } = useParams();

  const { data: component, isLoading } = useGetComponentQuery(
    component_id ? component_id : skipToken,
  );

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!component) {
    return (
      <EmptyState
        variant={EmptyStateVariant.xs}
        titleText="No component"
        headingLevel="h4"
      >
        <EmptyStateBody>
          {`There is not component with id ${component_id}`}
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: `/components`, title: "Components" },
          {
            to: `/components/${component_id}`,
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
      {component.type === "container" ? (
        <ContainerComponent
          key={component.etag}
          component={component}
          className="pf-v6-u-mt-md"
        />
      ) : (
        <ComponentDetails
          key={component.etag}
          component={component}
          className="pf-v6-u-mt-md"
        />
      )}
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <Title headingLevel="h3" size="xl" className="pf-v6-u-p-md">
            Jobs
          </Title>
          {component.jobs.length === 0 ? (
            <EmptyState
              variant={EmptyStateVariant.xs}
              titleText="No job"
              headingLevel="h4"
            >
              <EmptyStateBody>
                We did not find any jobs attached to this component.
              </EmptyStateBody>
            </EmptyState>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Job name</Th>
                  <Th className="text-center">Status</Th>
                  <Th className="text-center">tags</Th>
                  <Th className="text-center">Duration</Th>
                  <Th className="text-center">Created At</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortByNewestFirst(component.jobs).map((job, index) => (
                  <Tr key={index}>
                    <Td>
                      <Link to={`/jobs/${job.id}/jobStates`}>
                        {job.name || job.id}
                      </Link>
                    </Td>
                    <Td className="text-center">
                      <JobStatusLabel status={job.status} />
                    </Td>
                    <Td className="text-center">
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
                    </Td>
                    <Td className="text-center">
                      <span title={`Duration in seconds ${job.duration}`}>
                        <ClockIcon className="pf-v6-u-mr-xs" />
                        {humanizeDuration(job.duration)}
                      </span>
                    </Td>
                    <Td className="text-center">
                      <span title={`Created at ${job.created_at}`}>
                        <CalendarAltIcon className="pf-v6-u-mr-xs" />
                        {formatDate(job.created_at)}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </PageSection>
  );
}
