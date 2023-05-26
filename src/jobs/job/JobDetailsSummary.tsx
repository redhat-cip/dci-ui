import { useEffect, useState } from "react";
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";
import { Link, useNavigate } from "react-router-dom";
import {
  UsersIcon,
  ServerIcon,
  CubesIcon,
  ClockIcon,
  CalendarAltIcon,
  LinkIcon,
  CogIcon,
  CommentIcon,
  ExternalLinkAltIcon,
} from "@patternfly/react-icons";
import styled from "styled-components";
import { IEnhancedJob, IComponent, IResult, IJob } from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { isEmpty } from "lodash";
import TextAreaEditableOnHover from "./TextAreaEditableOnHover";
import { Markup } from "interweave";
import { getJobSilently, updateJobComment } from "jobs/jobsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { sortByName, sortByOldestFirst } from "services/sort";
import { getTopicIcon } from "ui/icons";
import {
  convertLinksToHtml,
  getBackground,
  getColor,
  getIcon,
} from "jobs/jobUtils";
import { TestLabels } from "jobs/components";

const CommentBloc = styled.div`
  display: flex;
  align-items: center;
`;

const Component = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface TestsProps {
  jobId: string;
  tests: IResult[];
}

function Tests({ jobId, tests }: TestsProps) {
  if (tests.length === 0) {
    return <div>no tests</div>;
  }
  return (
    <div>
      {sortByOldestFirst(tests).map((test, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: "0 1 auto",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Link to={`/jobs/${jobId}/tests/${test.file_id}`}>{test.name}</Link>
          </div>
          <div style={{ flex: "0 0 auto", marginLeft: "1em" }}>
            <TestLabels
              success={test.success}
              skips={test.skips}
              failures={test.failures}
              errors={test.errors}
              successfixes={test.successfixes}
              regressions={test.regressions}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ComponentsProps {
  components: Pick<IComponent, "id" | "topic_id" | "display_name">[];
}

export function Components({ components }: ComponentsProps) {
  const sortedComponents = sortByName(
    components.map((c) => ({ ...c, name: c.display_name }))
  );
  return (
    <div>
      {sortedComponents.map((component) => (
        <Component key={component.id} className="mt-xs">
          <Link to={`/topics/${component.topic_id}/components/${component.id}`}>
            {component.display_name}
          </Link>
        </Component>
      ))}
    </div>
  );
}

interface JobConfigurationProps {
  configuration: string;
}

export function JobConfiguration({ configuration }: JobConfigurationProps) {
  const navigate = useNavigate();
  return (
    <Button
      variant="link"
      isInline
      onClick={() => navigate(`/jobs?where=configuration:${configuration}`)}
    >
      {configuration}
    </Button>
  );
}

function JobName({ jobId }: { jobId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<IJob | null>(null);
  useEffect(() => {
    getJobSilently(jobId)
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setIsLoading(false));
  }, [jobId]);
  if (isLoading) return null;
  if (job) {
    return (
      <Button
        variant="link"
        onClick={() => window.open(`/jobs/${jobId}/jobStates`, "_blank")}
        isInline
      >
        {job.name} <ExternalLinkAltIcon style={{ fontSize: "0.7rem" }} />
      </Button>
    );
  }
  return <span>{jobId}</span>;
}

const Job = styled.div`
  background: ${(props: { status: string }) => getBackground(props.status)};
`;

interface JobDetailsSummaryProps {
  job: IEnhancedJob;
}

export default function JobDetailsSummary({ job }: JobDetailsSummaryProps) {
  const jobDuration = humanizeDuration(job.duration * 1000);
  const startedSince = fromNow(job.created_at);
  const [innerJob, setInnerJob] = useState<IEnhancedJob>(job);
  const dispatch = useDispatch<AppDispatch>();
  const TopicIcon = getTopicIcon(innerJob.topic?.name);
  const navigate = useNavigate();

  return (
    <Job status={innerJob.status}>
      <PageSection variant={PageSectionVariants.light}>
        <DescriptionList
          isFillColumns
          columnModifier={{ default: "2Col", lg: "3Col" }}
        >
          {innerJob.previous_job_id !== null && (
            <DescriptionListGroup>
              <DescriptionListTerm>Previous job</DescriptionListTerm>
              <DescriptionListDescription>
                <JobName jobId={innerJob.previous_job_id} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          <DescriptionListGroup>
            <DescriptionListTerm>Name</DescriptionListTerm>
            <DescriptionListDescription>
              {innerJob.name ? (
                <Button
                  variant="link"
                  onClick={() => navigate(`/jobs?where=name:${innerJob.name}`)}
                  isInline
                >
                  {innerJob.name}
                </Button>
              ) : (
                innerJob.topic?.name
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Status</DescriptionListTerm>
            <DescriptionListDescription>
              <span
                style={{
                  color: getColor(innerJob.status),
                }}
              >
                {getIcon(innerJob.status)} {innerJob.status}
              </span>
            </DescriptionListDescription>
          </DescriptionListGroup>
          {innerJob.status_reason && (
            <DescriptionListGroup>
              <DescriptionListTerm>Status reason</DescriptionListTerm>
              <DescriptionListDescription>
                <span
                  style={{
                    color: getColor(innerJob.status),
                  }}
                >
                  {innerJob.status_reason}
                </span>
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          <DescriptionListGroup>
            <DescriptionListTerm icon={<UsersIcon />}>Team</DescriptionListTerm>
            <DescriptionListDescription>
              <Button
                variant="link"
                onClick={() =>
                  navigate(`/jobs?where=team_id:${innerJob.team.id}`)
                }
                isInline
              >
                {innerJob.team?.name}
              </Button>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm icon={<ServerIcon />}>
              Remoteci
            </DescriptionListTerm>
            <DescriptionListDescription>
              <Button
                variant="link"
                onClick={() =>
                  navigate(`/jobs?where=remoteci_id:${innerJob.remoteci.id}`)
                }
                isInline
              >
                {innerJob.remoteci?.name}
              </Button>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm icon={<TopicIcon />}>
              Topic
            </DescriptionListTerm>
            <DescriptionListDescription>
              <Button
                variant="link"
                onClick={() =>
                  navigate(`/jobs?where=topic_id:${innerJob.topic.id}`)
                }
                isInline
              >
                {innerJob.topic?.name}
              </Button>
            </DescriptionListDescription>
          </DescriptionListGroup>
          {innerJob.configuration && (
            <DescriptionListGroup>
              <DescriptionListTerm icon={<CogIcon />}>
                Configuration
              </DescriptionListTerm>
              <DescriptionListDescription>
                {innerJob.configuration === null ? null : (
                  <JobConfiguration configuration={innerJob.configuration} />
                )}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {innerJob.url && (
            <DescriptionListGroup>
              <DescriptionListTerm icon={<LinkIcon />}>Url</DescriptionListTerm>
              <DescriptionListDescription>
                {innerJob.url === null ? null : (
                  <a href={innerJob.url}>{innerJob.url}</a>
                )}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          <DescriptionListGroup>
            <DescriptionListTerm>Tags</DescriptionListTerm>
            <DescriptionListDescription>
              {isEmpty(innerJob.tags)
                ? null
                : innerJob.tags?.map((tag, index) => (
                    <Label
                      key={index}
                      color="blue"
                      className="pointer mr-xs mb-xs"
                      onClick={() => {
                        navigate(`/jobs?where=tags:${tag}`);
                      }}
                      style={{ maxWidth: "100%" }}
                    >
                      <small
                        title={tag}
                        style={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {tag}
                      </small>
                    </Label>
                  ))}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm icon={<CubesIcon />}>
              Components
            </DescriptionListTerm>
            <DescriptionListDescription>
              <Components components={innerJob.components} />
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Tests</DescriptionListTerm>
            <DescriptionListDescription>
              <Tests jobId={innerJob.id} tests={innerJob.results} />
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm icon={<CalendarAltIcon />}>
              Created at
            </DescriptionListTerm>
            <DescriptionListDescription>
              <span title={`Created at ${innerJob.created_at}`}>
                {formatDate(innerJob.created_at)}
              </span>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm icon={<ClockIcon />}>
              Duration
            </DescriptionListTerm>
            <DescriptionListDescription>
              {innerJob.status === "new" ||
              innerJob.status === "pre-run" ||
              innerJob.status === "running" ? (
                <span title={`Job duration in seconds ${innerJob.duration}`}>
                  Started {startedSince}
                </span>
              ) : (
                <span title={`Job duration in seconds ${innerJob.duration}`}>
                  Ran for {jobDuration}
                </span>
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm icon={<CommentIcon />}>
              Comment
            </DescriptionListTerm>
            <DescriptionListDescription>
              <TextAreaEditableOnHover
                text={innerJob.comment || ""}
                onSubmit={(comment) => {
                  dispatch(
                    updateJobComment({
                      ...innerJob,
                      comment,
                    })
                  ).then(setInnerJob);
                }}
              >
                <CommentBloc>
                  <Markup content={convertLinksToHtml(innerJob.comment)} />
                </CommentBloc>
              </TextAreaEditableOnHover>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>
    </Job>
  );
}
