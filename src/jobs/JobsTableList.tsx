import { isEmpty } from "lodash";
import { Label, LabelGroup } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import {
  IEnhancedJob,
  IJobFilters,
  IJobStatus,
  IRemoteci,
  ITeam,
  ITopic,
  JobsTableListColumn,
} from "types";
import { fromNow, humanizeDuration } from "services/date";
import { getTopicIcon } from "ui/icons";
import { getBackground } from "./jobSummary/jobSummaryUtils";
import tableViewColumns from "./tableView/tableViewColumns";
import JobStatusLabel from "./JobStatusLabel";
import { sortByName } from "services/sort";

interface JobTableSummaryProps {
  job: IEnhancedJob;
  onTagClicked: (tag: string) => void;
  onRemoteciClicked: (remoteci: IRemoteci) => void;
  onTeamClicked: (team: ITeam) => void;
  onTopicClicked: (topic: ITopic) => void;
  onConfigurationClicked: (configuration: string) => void;
  onStatusClicked: (status: IJobStatus) => void;
  columns: JobsTableListColumn[];
}

function JobTableSummary({
  job,
  onTagClicked,
  onRemoteciClicked,
  onTeamClicked,
  onTopicClicked,
  onConfigurationClicked,
  onStatusClicked,
  columns,
}: JobTableSummaryProps) {
  const jobDuration = humanizeDuration(job.duration * 1000);
  const startedSince = fromNow(job.created_at);
  const TopicIcon = getTopicIcon(job.topic?.name);
  const principalComponent =
    job.components.find((component) => {
      const name = (
        component.canonical_project_name || component.name
      ).toLowerCase();
      return (
        name.indexOf("openshift ") !== -1 ||
        name.indexOf("rhel-") !== -1 ||
        name.indexOf("rhos-") !== -1
      );
    }) || null;
  const config = job.configuration;
  const columnTds: { [k in JobsTableListColumn]: React.ReactNode } = {
    name: (
      <Link to={`/jobs/${job.id}/jobStates`}>
        <span>{job.name || job.topic?.name}</span>
      </Link>
    ),
    status: (
      <JobStatusLabel
        status={job.status}
        className="pointer"
        onClick={() => onStatusClicked(job.status)}
      />
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
          {principalComponent.canonical_project_name || principalComponent.name}
        </Link>
      ),
    components:
      job.components.length === 0 ? null : (
        <ul>
          {sortByName(job.components).map((component) => (
            <li
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Link
                className="mr-xs"
                to={`/topics/${component.topic_id}/components/${component.id}`}
              >
                {component.canonical_project_name || component.name}
              </Link>
            </li>
          ))}
        </ul>
      ),
    tags:
      job.tags.length === 0 ? null : (
        <LabelGroup numLabels={10} isCompact>
          {job.tags.map((tag, index) => (
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
    duration: (
      <span title={`Job duration in seconds ${job.duration}`}>
        {jobDuration}
      </span>
    ),
    last_run: (
      <span title={`Created at ${job.created_at}`}>{startedSince}</span>
    ),
  };

  return (
    <tr
      key={`${job.id}.${job.etag}`}
      style={{ background: getBackground(job.status) }}
    >
      {columns.map((column, i) => (
        <td key={i}>{columnTds[column]}</td>
      ))}
    </tr>
  );
}

interface JobsTableListProps {
  jobs: IEnhancedJob[];
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
  columns: JobsTableListColumn[];
}

export default function JobsTableList({
  jobs,
  filters,
  setFilters,
  columns,
}: JobsTableListProps) {
  if (isEmpty(jobs)) return null;
  return (
    <table className="pf-c-table pf-m-compact pf-m-grid-md">
      <thead>
        <tr>
          {columns.map((column, i) => (
            <th key={i}>{tableViewColumns[column]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => {
          return (
            <JobTableSummary
              key={`${job.id}:${job.etag}`}
              columns={columns}
              job={job}
              onStatusClicked={(status) => {
                setFilters({
                  ...filters,
                  status,
                });
              }}
              onTagClicked={(tag) => {
                setFilters({
                  ...filters,
                  tags: [...filters.tags, tag],
                });
              }}
              onRemoteciClicked={(remoteci) => {
                setFilters({
                  ...filters,
                  remoteci_id: remoteci.id,
                });
              }}
              onTeamClicked={(team) => {
                setFilters({
                  ...filters,
                  team_id: team.id,
                });
              }}
              onTopicClicked={(topic) => {
                setFilters({
                  ...filters,
                  topic_id: topic.id,
                });
              }}
              onConfigurationClicked={(configuration) => {
                setFilters({
                  ...filters,
                  configuration: configuration,
                });
              }}
            />
          );
        })}
      </tbody>
    </table>
  );
}
