import {
  Button,
  Card,
  CardBody,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
} from "@patternfly/react-core";
import { Link, useNavigate } from "react-router";
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
  CodeBranchIcon,
} from "@patternfly/react-icons";
import { IEnhancedJob, IResult, IPipeline } from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { isEmpty } from "lodash";
import TextAreaEditableOnHover from "../TextAreaEditableOnHover";
import { Markup } from "interweave";
import { sortByOldestFirst } from "services/sort";
import { getTopicIcon } from "ui/icons";
import { convertLinksToHtml, getLabelColor } from "jobs/jobUtils";
import { JobStatusLabel, TestLabels } from "jobs/components";
import { useGetJobQuery, useUpdateJobMutation } from "jobs/jobsApi";
import { sumTests } from "jobs/components/TestsLabels";
import { ComponentsList } from "../../components/ComponentsList";

interface TestsProps {
  jobId: string;
  tests: IResult[];
}

function Tests({ jobId, tests }: TestsProps) {
  if (tests.length === 0) {
    return <div>no tests</div>;
  }
  const total = sumTests(tests);
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
            borderBottom: "1px dashed rgb(210, 210, 210)",
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "1em",
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
          total
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <TestLabels
            success={total.success}
            skips={total.skips}
            failures={total.failures}
            errors={total.errors}
            successfixes={total.successfixes}
            regressions={total.regressions}
          />
        </div>
      </div>
    </div>
  );
}

function JobConfiguration({ configuration }: { configuration: string }) {
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

function JobPipeline({ pipeline }: { pipeline: IPipeline }) {
  const navigate = useNavigate();
  return (
    <Button
      variant="link"
      isInline
      onClick={() => navigate(`/jobs?where=pipeline_id:${pipeline.id}`)}
    >
      {pipeline.name}
    </Button>
  );
}

function JobName({ jobId }: { jobId: string }) {
  const { data: job, isLoading } = useGetJobQuery(jobId);
  if (isLoading) return null;
  if (!job) return <span>{jobId}</span>;
  return (
    <Button
      icon={<ExternalLinkAltIcon style={{ fontSize: "0.7rem" }} />}
      variant="link"
      onClick={() => window.open(`/jobs/${job.id}/jobStates`, "_blank")}
      isInline
    >
      {job.name}
    </Button>
  );
}

interface JobDetailsHeaderProps {
  job: IEnhancedJob;
  [x: string]: any;
}

export default function JobDetailsHeader({
  job,
  ...props
}: JobDetailsHeaderProps) {
  const [updateJob] = useUpdateJobMutation();
  const jobDuration = humanizeDuration(job.duration * 1000);
  const startedSince = fromNow(job.created_at);
  const TopicIcon = getTopicIcon(job.topic?.name);
  const navigate = useNavigate();
  return (
    <Card {...props}>
      <CardBody>
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
          {job.pipeline === null ? null : (
            <DescriptionListGroup>
              <DescriptionListTerm
                icon={<CodeBranchIcon style={{ transform: "rotate(90deg)" }} />}
              >
                Pipeline
              </DescriptionListTerm>
              <DescriptionListDescription>
                <JobPipeline pipeline={job.pipeline} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          <DescriptionListGroup>
            <DescriptionListTerm>Status</DescriptionListTerm>
            <DescriptionListDescription>
              <div>
                <div>
                  <JobStatusLabel
                    status={job.status}
                    className="pointer"
                    style={{ zIndex: 1 }}
                  />
                </div>
                {job.status_reason && (
                  <div>
                    <Label
                      isCompact
                      className="pf-v6-u-mt-xs"
                      color={getLabelColor(job.status)}
                      style={{ maxWidth: 480 }}
                    >
                      {job.status_reason}
                    </Label>
                  </div>
                )}
              </div>
            </DescriptionListDescription>
          </DescriptionListGroup>
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
            <DescriptionListTerm icon={<TopicIcon />}>
              Topic
            </DescriptionListTerm>
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
                      className="pf-v6-u-mr-xs pf-v6-u-mb-xs"
                      onClick={() => {
                        navigate(`/jobs?where=tags:${tag}`);
                      }}
                      isCompact
                    >
                      {tag}
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
                    className="pf-v6-u-mr-xs pf-v6-u-mb-xs"
                    isCompact
                  >
                    {kv.key}:{kv.value}
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
              <ComponentsList components={job.components} />
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Markup content={convertLinksToHtml(job.comment)} />
                </div>
              </TextAreaEditableOnHover>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
}
