import { Label, LabelGroup } from "@patternfly/react-core";
import { createSearchParams, Link } from "react-router-dom";
import {
  IEnhancedJob,
  IJobStatus,
  IRemoteci,
  ITeam,
  ITopic,
  JobsTableListColumn,
  RangeOptionValue,
} from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { getTopicIcon } from "ui/icons";
import { getBackground } from "jobs/jobUtils";
import {
  TestsLabels,
  JobStatusLabel,
  ComponentsListInJobRow,
} from "jobs/components";
import { CopyIconButton } from "ui";
import { getPrincipalComponent } from "component/componentSelector";
import { DateTime } from "luxon";

interface JobTableSummaryProps {
  job: IEnhancedJob;
  isPipelineJob: boolean;
  isTheLastPipelineJob: boolean;
  isPipelineRoot: boolean;
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
  isPipelineJob,
  isTheLastPipelineJob,
  isPipelineRoot,
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
  const columnTds: { [k in JobsTableListColumn]: React.ReactNode } = {
    id: (
      <span>
        <CopyIconButton
          text={job.id}
          textOnSuccess="copied"
          className="mr-xs pointer"
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
    name: (
      <Link to={`/jobs/${job.id}/jobStates`}>
        <span>{job.name || job.topic?.name}</span>
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
          <TopicIcon className="mr-xs" />
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

  const VerticalHalfLine = () => (
    <div
      style={{
        position: "absolute",
        left: "34px",
        top: "50%",
        right: "0",
        bottom: "0",
        borderLeft: "1px solid #6A6E73",
      }}
    ></div>
  );

  const BottomRightLine = () => (
    <div
      style={{
        position: "absolute",
        left: "34px",
        top: "0",
        right: "72px",
        bottom: "50%",
        borderLeft: "1px solid #6A6E73",
        borderBottom: "1px solid #6A6E73",
      }}
    ></div>
  );

  return (
    <tr
      key={`${job.id}.${job.etag}`}
      style={{
        background: getBackground(job.status),
        borderBottom: isPipelineJob
          ? isTheLastPipelineJob
            ? "1px solid #d2d2d2"
            : "0"
          : "1px solid #d2d2d2",
      }}
    >
      <td
        style={{
          padding: 0,
          width: "135px",
          position: "relative",
        }}
      >
        {isPipelineJob ? (
          isPipelineRoot ? (
            <VerticalHalfLine />
          ) : isTheLastPipelineJob ? (
            <BottomRightLine />
          ) : (
            <>
              <VerticalHalfLine />
              <BottomRightLine />
            </>
          )
        ) : null}

        <div
          style={{
            position: "absolute",
            left: isPipelineRoot ? "21px" : "42px",
            top: "calc(50% - 12px)",
          }}
        >
          <JobStatusLabel
            status={job.status}
            className="pointer"
            onClick={() => onStatusClicked(job.status)}
          />
        </div>
      </td>
      {columns.map((column, i) => (
        <td
          key={i}
          style={{
            verticalAlign: "middle",
          }}
        >
          {columnTds[column]}
        </td>
      ))}
    </tr>
  );
}