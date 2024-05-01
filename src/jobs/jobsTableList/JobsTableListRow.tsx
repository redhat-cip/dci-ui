import { Label, LabelGroup } from "@patternfly/react-core";
import { createSearchParams, Link } from "react-router-dom";
import {
  JobNode,
  IJobStatus,
  IRemoteci,
  ITeam,
  ITopic,
  JobsTableListColumn,
  RangeOptionValue,
} from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { getTopicIcon } from "ui/icons";
import { getBackgroundColor } from "jobs/jobUtils";
import {
  TestsLabels,
  JobStatusLabel,
  ComponentsListInJobRow,
} from "jobs/components";
import { CopyIconButton } from "ui";
import { getPrincipalComponent } from "component/componentSelector";
import { DateTime } from "luxon";
import { Tr, Td } from "@patternfly/react-table";
import { useTheme } from "ui/Theme/themeContext";

interface JobTableSummaryProps {
  job: JobNode;
  level: number;
  onTagClicked: (tag: string) => void;
  onRemoteciClicked: (remoteci: IRemoteci) => void;
  onTeamClicked: (team: ITeam) => void;
  onTopicClicked: (topic: ITopic) => void;
  onConfigurationClicked: (configuration: string) => void;
  onStatusClicked: (status: IJobStatus) => void;
  columns: JobsTableListColumn[];
}

export default function JobTableSummary({
  job,
  level,
  onTagClicked,
  onRemoteciClicked,
  onTeamClicked,
  onTopicClicked,
  onConfigurationClicked,
  onStatusClicked,
  columns,
}: JobTableSummaryProps) {
  const jobDuration = humanizeDuration(job.duration * 1000);
  const TopicIcon = getTopicIcon(job.topic?.name);
  const principalComponent = getPrincipalComponent(job.components);
  const config = job.configuration;
  const jobCreatedAt = DateTime.fromISO(job.created_at, { zone: "utc" });
  const { isDark } = useTheme();
  const columnTds: { [k in JobsTableListColumn]: React.ReactNode } = {
    id: (
      <span>
        <CopyIconButton
          text={job.id}
          textOnSuccess="copied"
          className="pf-v5-u-mr-xs pointer"
        />
        {job.id}
      </span>
    ),
    pipeline: (
      <Link
        to={{
          pathname: "/analytics/pipelines",
          search: createSearchParams({
            teams_ids: [job.team_id],
            range: "custom" as RangeOptionValue,
            start_date: jobCreatedAt.startOf("day").toISODate() || "",
            end_date: jobCreatedAt.endOf("day").toISODate() || "",
            pipelines_names: job.pipeline === null ? [] : [job.pipeline.name],
          }).toString(),
        }}
      >
        <span>{job.pipeline?.name}</span>
      </Link>
    ),
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
          <TopicIcon className="pf-v5-u-mr-xs" />
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
    keysValues:
      job.keys_values?.length === 0 ? null : (
        <LabelGroup numLabels={10} isCompact>
          {job.keys_values?.map((kv, index) => (
            <Label key={index} color="blue" isCompact>
              {kv.key}:{kv.value}
            </Label>
          ))}
        </LabelGroup>
      ),
    created_at: (
      <span title={`Created at ${job.created_at}`}>
        {formatDate(job.created_at)}
      </span>
    ),
    duration: (
      <span title={`Job duration in seconds ${job.duration}`}>
        {jobDuration}
      </span>
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
        borderBottom: "1px solid #6A6E73",
        borderLeft: "1px solid #6A6E73",
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
          borderTop:
            level === 0 ? `1px solid ${isDark ? "#444548" : "#d2d2d2"}` : "0",
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
        />
      ))}
    </>
  );
}
