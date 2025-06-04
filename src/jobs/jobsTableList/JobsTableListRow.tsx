import { Label, LabelGroup } from "@patternfly/react-core";
import { createSearchParams, Link } from "react-router";
import {
  JobNode,
  IJobStatus,
  IRemoteci,
  ITeam,
  ITopic,
  JobsTableListColumn,
  TimeRange,
  IPipeline,
} from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import TopicIcon from "topics/TopicIcon";
import { getBackgroundColor } from "jobs/jobUtils";
import {
  TestsLabels,
  JobStatusLabel,
  ComponentsListInJobRow,
} from "jobs/components";
import { CopyIconButton } from "ui";
import { getPrincipalComponent } from "topics/component/componentSelector";
import { DateTime } from "luxon";
import { Tr, Td } from "@patternfly/react-table";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import {
  t_global_border_color_200,
  t_global_border_color_300,
} from "@patternfly/react-tokens";
import JobKeysValues from "jobs/components/JobKeysValues";

interface JobTableSummaryProps {
  job: JobNode;
  level: number;
  onTagClicked: (tag: string) => void;
  onRemoteciClicked: (remoteci: IRemoteci) => void;
  onTeamClicked: (team: ITeam) => void;
  onTopicClicked: (topic: ITopic) => void;
  onConfigurationClicked: (configuration: string) => void;
  onPipelineClicked: (pipeline: IPipeline) => void;
  onStatusClicked: (status: IJobStatus) => void;
  columns: JobsTableListColumn[];
}

function PipelineLink({ pipeline }: { pipeline: IPipeline }) {
  const pipelineCreatedAt = DateTime.fromISO(pipeline.created_at, {
    zone: "utc",
  });
  return (
    <Link
      className="pf-v6-u-ml-xs"
      to={{
        pathname: "/analytics/pipelines",
        search: createSearchParams({
          query: `(pipeline.id='${pipeline.id}')`,
          range: "custom" as TimeRange,
          after: pipelineCreatedAt.startOf("day").toISODate() || "",
          before: pipelineCreatedAt.endOf("day").toISODate() || "",
        }).toString(),
      }}
    >
      <ExternalLinkAltIcon />
    </Link>
  );
}

export default function JobTableSummary({
  job,
  level,
  onTagClicked,
  onRemoteciClicked,
  onTeamClicked,
  onTopicClicked,
  onConfigurationClicked,
  onPipelineClicked,
  onStatusClicked,
  columns,
}: JobTableSummaryProps) {
  const jobDuration = humanizeDuration(job.duration);
  const principalComponent = getPrincipalComponent(job.components);
  const config = job.configuration;
  const pipeline = job.pipeline;
  const columnTds: { [k in JobsTableListColumn]: React.ReactNode } = {
    id: (
      <span>
        <CopyIconButton
          text={job.id}
          textOnSuccess="copied"
          className="pf-v6-u-mr-xs pointer"
        />
        {job.id}
      </span>
    ),
    pipeline: pipeline ? (
      <div
        style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center" }}
      >
        <Label
          isCompact
          color="grey"
          className="pointer"
          onClick={() => onPipelineClicked(pipeline)}
        >
          {pipeline.name}
        </Label>
        <PipelineLink pipeline={pipeline} />
      </div>
    ) : null,
    config: config ? (
      <Label
        isCompact
        color="grey"
        className="pointer"
        onClick={() => onConfigurationClicked(config)}
      >
        {config}
      </Label>
    ) : null,
    team: (
      <Label
        isCompact
        color="grey"
        className="pointer"
        onClick={() => onTeamClicked(job.team)}
      >
        {job.team?.name}
      </Label>
    ),
    remoteci: (
      <Label
        isCompact
        color="grey"
        className="pointer"
        onClick={() => onRemoteciClicked(job.remoteci)}
      >
        {job.remoteci?.name}
      </Label>
    ),
    topic: (
      <Label
        isCompact
        color="grey"
        className="pointer"
        onClick={() => onTopicClicked(job.topic)}
      >
        {job.topic?.name}
      </Label>
    ),
    component:
      principalComponent === null ? null : (
        <Link
          to={`/topics/${principalComponent.topic_id}/components/${principalComponent.id}`}
        >
          <TopicIcon name={job.topic?.name} className="pf-v6-u-mr-xs" />
          {principalComponent.display_name}
        </Link>
      ),
    components:
      job.components.length === 0 ? null : (
        <ComponentsListInJobRow components={job.components} />
      ),
    tests:
      job.results.length === 0 ? null : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TestsLabels tests={job.results} />
        </div>
      ),
    tags:
      job.tags?.length === 0 ? null : (
        <LabelGroup numLabels={10} isCompact>
          {job.tags?.map((tag, index) => (
            <Label
              key={index}
              color="blue"
              className="pointer"
              isCompact
              onClick={() => onTagClicked && onTagClicked(tag)}
            >
              {tag}
            </Label>
          ))}
        </LabelGroup>
      ),
    keysValues: <JobKeysValues keys_values={job.keys_values} />,
    created_at: (
      <span title={`Created at ${job.created_at}`}>
        {formatDate(job.created_at)}
      </span>
    ),
    duration:
      job.status === "new" ||
      job.status === "pre-run" ||
      job.status === "running" ? null : (
        <span title={`${job.duration} seconds`}>{jobDuration}</span>
      ),
    started: (
      <span title={`Created at ${job.created_at}`}>
        {fromNow(job.created_at)}
      </span>
    ),
  };
  const distanceBetweenLeftAndStatusLabelIcon = 13;
  const maxSizeStatusLabel = 72;
  const statusLabelIndent = 21;
  const horizontalPadding = statusLabelIndent * 2;

  const BottomRightLine = () => (
    <div
      style={{
        position: "absolute",
        left: `${
          statusLabelIndent * level + distanceBetweenLeftAndStatusLabelIcon
        }px`,
        width: "15px",
        bottom: "50%",
        borderBottom: `1px solid ${t_global_border_color_300.value}`,
        borderLeft: `1px solid ${t_global_border_color_300.value}`,
        height: "100%",
      }}
    ></div>
  );

  return (
    <>
      <Tr
        key={`${job.id}.${job.etag}`}
        style={{
          position: "relative",
          borderTopWidth: "1px",
          borderTopStyle: level === 0 ? "solid" : "none",
          borderBlockEndStyle: "none",
          borderTopColor: t_global_border_color_200.var,
        }}
      >
        <Td
          style={{
            padding: 0,
            width: `${
              statusLabelIndent * level + maxSizeStatusLabel + horizontalPadding
            }px`,
          }}
        >
          <div
            style={{
              width: 5,
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              backgroundColor: getBackgroundColor(job.status),
            }}
          ></div>
          {level !== 0 && <BottomRightLine />}
          <div
            style={{
              position: "absolute",
              left: `${statusLabelIndent * (level + 1)}px`,
              top: "calc(50% - 12px)",
            }}
          >
            <JobStatusLabel
              status={job.status}
              className="pointer"
              onClick={() => onStatusClicked(job.status)}
              style={{ zIndex: 1 }}
            />
          </div>
        </Td>
        <Td
          style={{
            verticalAlign: "middle",
          }}
        >
          <Link to={`/jobs/${job.id}/jobStates`}>
            <span>{job.name || job.topic?.name}</span>
          </Link>
        </Td>
        {columns.map((column, i) => (
          <Td
            key={i}
            style={{
              verticalAlign: "middle",
            }}
          >
            {columnTds[column]}
          </Td>
        ))}
      </Tr>
      {job.children.map((child, i, arr) => (
        <JobTableSummary
          key={child.id}
          job={child}
          level={level + 1}
          columns={columns}
          onStatusClicked={onStatusClicked}
          onTagClicked={onTagClicked}
          onRemoteciClicked={onRemoteciClicked}
          onTeamClicked={onTeamClicked}
          onTopicClicked={onTopicClicked}
          onConfigurationClicked={onConfigurationClicked}
          onPipelineClicked={onPipelineClicked}
        />
      ))}
    </>
  );
}
