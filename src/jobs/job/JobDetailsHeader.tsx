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
import { IEnhancedJob, IComponent, IResult } from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { isEmpty } from "lodash";
import TextAreaEditableOnHover from "./TextAreaEditableOnHover";
import { Markup } from "interweave";
import { sortByName, sortByOldestFirst } from "services/sort";
import { getTopicIcon } from "ui/icons";
import { convertLinksToHtml, getColor, getIcon } from "jobs/jobUtils";
import { TestLabels } from "jobs/components";
import { useGetJobQuery, useUpdateJobMutation } from "jobs/jobsApi";

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
            gap: "1em",
            borderBottom:
              tests.length === i + 1 ? "none" : "1px dashed rgb(210, 210, 210)",
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
          <div style={{ flex: "0 0 auto" }}>
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
    components.map((c) => ({ ...c, name: c.display_name })),
  );
  return (
    <div>
      {sortedComponents.map((component) => (
        <Component key={component.id} className="pf-v5-u-mt-xs">
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
  const { data: job, isLoading } = useGetJobQuery(jobId);
  if (isLoading) return null;
  if (!job) return <span>{jobId}</span>;
  return (
    <Button
      variant="link"
      onClick={() => window.open(`/jobs/${job.id}/jobStates`, "_blank")}
      isInline
    >
      {job.name} <ExternalLinkAltIcon style={{ fontSize: "0.7rem" }} />
    </Button>
  );
}

interface JobDetailsHeaderProps {
  job: IEnhancedJob;
}

export default function JobDetailsHeader({ job }: JobDetailsHeaderProps) {
  const [updateJob] = useUpdateJobMutation();
  const jobDuration = humanizeDuration(job.duration * 1000);
  const startedSince = fromNow(job.created_at);
  const TopicIcon = getTopicIcon(job.topic?.name);
  const navigate = useNavigate();
  return (
    <PageSection variant={PageSectionVariants.light}>
      <DescriptionList
        isFillColumns
        columnModifier={{ default: "2Col", lg: "3Col" }}
      >
        {job.previous_job_id !== null && (
          <DescriptionListGroup>
            <DescriptionListTerm>Previous job</DescriptionListTerm>
            <DescriptionListDescription>
              <JobName jobId={job.previous_job_id} />
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>
            {job.name ? (
              <Button
                variant="link"
                onClick={() => navigate(`/jobs?where=name:${job.name}`)}
                isInline
              >
                {job.name}
              </Button>
            ) : (
              job.topic?.name
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription>
            <span
              style={{
                color: getColor(job.status),
              }}
            >
              {getIcon(job.status)} {job.status}
            </span>
          </DescriptionListDescription>
        </DescriptionListGroup>
        {job.status_reason && (
          <DescriptionListGroup>
            <DescriptionListTerm>Status reason</DescriptionListTerm>
            <DescriptionListDescription>
              <span
                style={{
                  color: getColor(job.status),
                }}
              >
                {job.status_reason}
              </span>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        <DescriptionListGroup>
          <DescriptionListTerm icon={<UsersIcon />}>Team</DescriptionListTerm>
          <DescriptionListDescription>
            <Button
              variant="link"
              onClick={() => navigate(`/jobs?where=team_id:${job.team.id}`)}
              isInline
            >
              {job.team?.name}
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
                navigate(`/jobs?where=remoteci_id:${job.remoteci.id}`)
              }
              isInline
            >
              {job.remoteci?.name}
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm icon={<TopicIcon />}>Topic</DescriptionListTerm>
          <DescriptionListDescription>
            <Button
              variant="link"
              onClick={() => navigate(`/jobs?where=topic_id:${job.topic.id}`)}
              isInline
            >
              {job.topic?.name}
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        {job.configuration && (
          <DescriptionListGroup>
            <DescriptionListTerm icon={<CogIcon />}>
              Configuration
            </DescriptionListTerm>
            <DescriptionListDescription>
              {job.configuration === null ? null : (
                <JobConfiguration configuration={job.configuration} />
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {job.url && (
          <DescriptionListGroup>
            <DescriptionListTerm icon={<LinkIcon />}>Url</DescriptionListTerm>
            <DescriptionListDescription>
              {job.url === null ? null : <a href={job.url}>{job.url}</a>}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        <DescriptionListGroup>
          <DescriptionListTerm>Tags</DescriptionListTerm>
          <DescriptionListDescription>
            {isEmpty(job.tags)
              ? null
              : job.tags?.map((tag, index) => (
                  <Label
                    key={index}
                    color="blue"
                    className="pointer pf-v5-u-mr-xs pf-v5-u-mb-xs"
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
        {isEmpty(job.keys_values) ? null : (
          <DescriptionListGroup>
            <DescriptionListTerm>Keys values</DescriptionListTerm>
            <DescriptionListDescription>
              {job.keys_values.map((kv, index) => (
                <Label
                  key={index}
                  color="blue"
                  className="pf-v5-u-mr-xs pf-v5-u-mb-xs"
                  style={{ maxWidth: "100%" }}
                >
                  <small
                    title={`${kv.key}:${kv.value}`}
                    style={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {`${kv.key}:${kv.value}`}
                  </small>
                </Label>
              ))}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        <DescriptionListGroup>
          <DescriptionListTerm icon={<CubesIcon />}>
            Components
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Components components={job.components} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Tests</DescriptionListTerm>
          <DescriptionListDescription>
            <Tests jobId={job.id} tests={job.results} />
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm icon={<CalendarAltIcon />}>
            Created at
          </DescriptionListTerm>
          <DescriptionListDescription>
            <span title={`Created at ${job.created_at}`}>
              {formatDate(job.created_at)}
            </span>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm icon={<ClockIcon />}>
            Duration
          </DescriptionListTerm>
          <DescriptionListDescription>
            {job.status === "new" ||
            job.status === "pre-run" ||
            job.status === "running" ? (
              <span title={`Job duration in seconds ${job.duration}`}>
                Started {startedSince}
              </span>
            ) : (
              <span title={`Job duration in seconds ${job.duration}`}>
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
              text={job.comment || ""}
              onSubmit={(comment) => {
                updateJob({
                  ...job,
                  comment,
                });
              }}
            >
              <CommentBloc>
                <Markup content={convertLinksToHtml(job.comment)} />
              </CommentBloc>
            </TextAreaEditableOnHover>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </PageSection>
  );
}
