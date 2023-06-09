import { useEffect, useState, useCallback } from "react";
import MainPage from "pages/MainPage";
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
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb, CopyButton, StateLabel } from "ui";
import {
  IComponentCoverage,
  IComponentWithJobs,
  IJob,
  IJobStatus,
} from "types";
import { useParams, Link } from "react-router-dom";
import { fetchComponent } from "./componentActions";
import { CalendarAltIcon, ClockIcon } from "@patternfly/react-icons";
import { fromNow, formatDate } from "services/date";
import { sortByNewestFirst } from "services/sort";
import { humanizeDuration } from "services/date";
import { StatHeaderCard } from "analytics/LatestJobStatus/LatestJobStatusDetailsPage";
import { getPercentageOfSuccessfulJobs } from "./stats";
import { JobStatusLabel } from "jobs/components";
import CardLine from "ui/CardLine";
import LastComponentsJobsBarChart from "analytics/ComponentCoverage/LastComponentsJobsBarChart";
import { global_palette_black_500 } from "@patternfly/react-tokens";
import { DateTime } from "luxon";
import { useAuth } from "auth/authContext";
import { useDispatch, useSelector } from "react-redux";
import { getTopicById } from "topics/topicsSelectors";
import topicsActions from "topics/topicsActions";
import { AppDispatch } from "store";
import { getTopicIcon } from "ui/icons";

interface IEmbedJobProps {
  job: IJob;
}

function EmbedJob({ job }: IEmbedJobProps) {
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
                  className="mr-xs mt-xs"
                >
                  <small>{tag}</small>
                </Label>
              ))}
          </div>
        </GridItem>
        <GridItem span={2}>
          <span title={`Duration in seconds ${job.duration}`}>
            <ClockIcon className="mr-xs" />
            {humanizeDuration(job.duration * 1000)}
          </span>
        </GridItem>
        <GridItem span={2}>
          <span title={`Created at ${job.created_at}`}>
            <CalendarAltIcon className="mr-xs" />
            {formatDate(job.created_at)}
          </span>
        </GridItem>
      </Grid>
    </div>
  );
}

function TopicLink({ topic_id }: { topic_id: string }) {
  const topic = useSelector(getTopicById(topic_id));

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(topicsActions.one(topic_id));
  }, [dispatch, topic_id]);

  if (topic === null) {
    return <Skeleton screenreaderText="Loading topic name" />;
  }
  const TopicIcon = getTopicIcon(topic.name);
  return (
    <Link to={`/topics/${topic.id}/components`}>
      <TopicIcon className="pf-u-mr-xs" />
      {topic.name}
    </Link>
  );
}

function ComponentDetails({ component }: { component: IComponentWithJobs }) {
  const [seeData, setSeeData] = useState(false);
  const { identity } = useAuth();
  const componentData = JSON.stringify(component.data, null, 2);
  return (
    <div>
      <Title headingLevel="h3" size="xl" className="p-md">
        Component information
      </Title>
      <Divider />
      <CardLine className="p-md" field="ID" value={component.id} />
      <Divider />
      <CardLine className="p-md" field="Name" value={component.display_name} />
      <Divider />
      <CardLine className="p-md" field="Version" value={component.version} />
      <Divider />
      {component.uid !== "" && (
        <>
          <CardLine className="p-md" field="Unique id" value={component.uid} />
          <Divider />
        </>
      )}
      <CardLine
        className="p-md"
        field="Topic"
        value={<TopicLink topic_id={component.topic_id} />}
      />
      <Divider />
      {identity?.hasReadOnlyRole && component.url !== "" && (
        <>
          <CardLine
            className="p-md"
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
      <CardLine className="p-md" field="Type" value={component.type} />
      <Divider />
      <CardLine
        className="p-md"
        field="Data"
        value={
          seeData ? (
            <Button
              onClick={() => setSeeData(false)}
              type="button"
              variant="tertiary"
              isSmall
            >
              hide content
            </Button>
          ) : (
            <Button
              onClick={() => setSeeData(true)}
              type="button"
              variant="tertiary"
              isSmall
            >
              see content
            </Button>
          )
        }
      />
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
        className="p-md"
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
      <Divider />
      <CardLine
        className="p-md"
        field="State"
        value={<StateLabel state={component.state} />}
      />
      <Divider />
      <CardLine
        className="p-md"
        field="Created"
        value={fromNow(component.created_at)}
      />
      <CardLine
        className="p-md"
        field="Release date"
        value={formatDate(component.released_at, DateTime.DATE_MED)}
      />
    </div>
  );
}

function convertComponentWithJobInComponentCoverage(
  component: IComponentWithJobs
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
    }
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
  const [isFetching, setIsFetching] = useState(true);
  const [component, setComponent] = useState<IComponentWithJobs | null>(null);

  const getComponentCallback = useCallback(() => {
    if (component_id) {
      fetchComponent(component_id)
        .then((response) => setComponent(response.data.component))
        .finally(() => setIsFetching(false));
    }
  }, [component_id, setIsFetching]);

  useEffect(() => {
    getComponentCallback();
  }, [getComponentCallback]);

  if (!component_id || !topic_id) return null;

  return (
    <MainPage
      title={component ? `Component ${component.display_name}` : "Component"}
      loading={isFetching && component === null}
      empty={!isFetching && component === null}
      description={
        component
          ? `Details page for component ${component.display_name}`
          : "Details page"
      }
      EmptyComponent={
        <EmptyState
          title="There is no component"
          info={`There is not component with id ${component_id}`}
        />
      }
      Breadcrumb={
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
      }
    >
      {component === null ? null : (
        <>
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
                  <p
                    style={{
                      color: global_palette_black_500.value,
                      fontWeight: "bold",
                    }}
                  >
                    Lastest jobs
                  </p>
                  <LastComponentsJobsBarChart
                    component={convertComponentWithJobInComponentCoverage(
                      component
                    )}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Card className="mt-md">
            <CardBody>
              <ComponentDetails key={component.etag} component={component} />
            </CardBody>
          </Card>

          <Card className="mt-md">
            <CardBody>
              <Title headingLevel="h3" size="xl" className="p-md">
                Jobs
              </Title>
              <div className="p-md">
                <Grid hasGutter>
                  <GridItem span={3}>Job name</GridItem>
                  <GridItem span={2}>Status</GridItem>
                  <GridItem span={3}>tags</GridItem>
                  <GridItem span={2}>Duration</GridItem>
                  <GridItem span={2}>Created At</GridItem>
                </Grid>
              </div>
              {component.jobs.length === 0 ? (
                <div className="p-md">
                  <Divider /> There is no job attached to this component
                </div>
              ) : (
                sortByNewestFirst(component.jobs).map((j) => (
                  <div>
                    <Divider />
                    <div className="p-md">
                      <EmbedJob job={j} />
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </>
      )}
    </MainPage>
  );
}
