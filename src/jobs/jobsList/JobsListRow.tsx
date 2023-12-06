import { Label, LabelGroup } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import {
  global_BackgroundColor_200,
  global_Color_light_200,
  global_Color_400,
  global_Color_light_100,
} from "@patternfly/react-tokens";
import {
  UsersIcon,
  ServerIcon,
  ClockIcon,
  CalendarAltIcon,
  CaretRightIcon,
  LinkIcon,
  InfoCircleIcon,
} from "@patternfly/react-icons";
import styled from "styled-components";
import { IJob, IRemoteci, ITeam, ITopic } from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { CopyIconButton } from "ui";
import TextAreaEditableOnHover from "./TextAreaEditableOnHover";
import { Markup } from "interweave";
import { sortByOldestFirst } from "services/sort";
import { getTopicIcon } from "ui/icons";
import JobConfiguration from "./JobConfiguration";
import {
  convertLinksToHtml,
  getBackground,
  getColor,
  getIcon,
} from "../jobUtils";
import { ComponentsListInJobRow, TestLabels } from "jobs/components";
import { useTheme } from "ui/Theme/themeContext";
import { useUpdateJobMutation } from "jobs/jobsApi";

const Job = styled.div<{ status: string; isDark: boolean }>`
  background: ${({ status, isDark }) =>
    getBackground(status, isDark ? "#1f1d21" : global_Color_light_100.value)};
  min-height: 120px;
  width: 100%;
  padding: 0;
  padding-left: 5px; /* because of 5px in getBackground */
  display: grid;
  grid-template-columns: 64px 1fr;
  grid-auto-rows: auto;
  grid-template-areas:
    "icon title"
    "tag tag"
    "components components"
    "date date"
    "tests tests";

  &:focus-within {
    background: ${({ status, isDark }) =>
      getBackground(status, isDark ? "#1f1d21" : global_Color_light_200.value)};
  }

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 64px 1fr 1fr 1fr 64px;
    grid-auto-rows: auto;
    grid-template-areas:
      "icon title components date nav"
      "icon tag tag tag nav"
      "icon tests tests tests nav"
      "icon pad pad pad nav";
  }
`;

const JobIcon = styled.div`
  grid-area: icon;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;

  @media (min-width: 992px) {
    padding-right: 0;
  }
`;

const JobTitle = styled.div`
  grid-area: title;
  padding: 1em;
  padding-bottom: 0;
  overflow: hidden;
`;

const TopicName = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
`;

const JobId = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: ${global_Color_400.value};
`;

const JobComponents = styled.div`
  grid-area: components;
  padding: 1em;
  padding-bottom: 0;
  overflow: hidden;
`;

const JobDate = styled.div`
  grid-area: date;
  padding: 1em;
  padding-bottom: 0;
`;

const JobTags = styled.div`
  grid-area: tag;
  padding: 0.25em 1em;
  padding-bottom: 0;
`;

const JobNav = styled.div<{ isDark: boolean }>`
  grid-area: nav;
  display: none;
  border-left: 1px dashed
    ${({ isDark }) => (isDark ? "#444548" : global_BackgroundColor_200.value)};
  @media (min-width: 992px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const JobLink = styled(Link)`
  text-decoration: none;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  &:hover {
    background-color: ${global_BackgroundColor_200.value};
  }
`;

const JobTests = styled.div`
  grid-area: tests;
  padding: 0.25em 1em;
  padding-bottom: 0;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  @media (min-width: 992px) {
    flex-direction: row;
  }

  .pf-v5-c-label-group__label {
    max-width: 200px;
  }
`;

const JobComment = styled.div``;

const CommentBloc = styled.div`
  display: flex;
  align-items: center;
`;

const Pad = styled.div`
  grid-area: pad;
  height: 1em;
`;

interface JobsListRowProps {
  job: IJob;
  onTagClicked?: (tag: string) => void;
  onRemoteciClicked?: (remoteci: IRemoteci) => void;
  onTeamClicked?: (team: ITeam) => void;
  onTopicClicked?: (topic: ITopic) => void;
  onConfigurationClicked?: (configuration: string) => void;
}

export default function JobsListRow({
  job,
  onTagClicked,
  onRemoteciClicked,
  onTeamClicked,
  onTopicClicked,
  onConfigurationClicked,
}: JobsListRowProps) {
  const [updateJob] = useUpdateJobMutation();
  const jobDuration = humanizeDuration(job.duration * 1000);
  const startedSince = fromNow(job.created_at);
  const TopicIcon = getTopicIcon(job.topic?.name);
  const { isDark } = useTheme();
  return (
    <Job status={job.status} isDark={isDark}>
      <JobIcon title={`job status ${job.status}`}>
        <span style={{ color: getColor(job.status), fontSize: "2em" }}>
          {getIcon(job.status)}
        </span>
      </JobIcon>
      <JobTitle>
        <TopicName tabIndex={-1} to={`/jobs/${job.id}/jobStates`}>
          {job.name || job.topic?.name}
        </TopicName>
        <JobId className="pf-v5-u-mt-xs">
          <CopyIconButton
            text={job.id}
            textOnSuccess="copied"
            className="pf-v5-u-mr-xs pointer"
          />
          {job.id}
        </JobId>
        <div className="pf-v5-u-mt-xs">
          <span
            role="button"
            tabIndex={0}
            className={onTeamClicked && "pointer"}
            onClick={() => onTeamClicked && onTeamClicked(job.team)}
            onKeyDown={() => onTeamClicked && onTeamClicked(job.team)}
          >
            <UsersIcon className="pf-v5-u-mr-xs" />
            {job.team?.name}
          </span>
        </div>
        <div className="pf-v5-u-mt-xs">
          <span
            role="button"
            tabIndex={0}
            className={onRemoteciClicked && "pointer"}
            onClick={() => onRemoteciClicked && onRemoteciClicked(job.remoteci)}
            onKeyDown={() =>
              onRemoteciClicked && onRemoteciClicked(job.remoteci)
            }
          >
            <ServerIcon className="pf-v5-u-mr-xs" />
            {job.remoteci?.name}
          </span>
        </div>
        <div className="pf-v5-u-mt-xs">
          <span
            role="button"
            tabIndex={0}
            className={onTopicClicked && "pointer"}
            onClick={() => onTopicClicked && onTopicClicked(job.topic)}
            onKeyDown={() => onTopicClicked && onTopicClicked(job.topic)}
          >
            <TopicIcon className="pf-v5-u-mr-xs" />
            {job.topic?.name}
          </span>
        </div>
        {job.configuration === null ? null : (
          <JobConfiguration
            configuration={job.configuration}
            onClick={onConfigurationClicked}
          />
        )}
      </JobTitle>
      {job.tags?.length === 0 ? null : (
        <JobTags>
          <LabelGroup numLabels={8}>
            {job.tags?.map((tag, index) => (
              <Label
                key={index}
                color="blue"
                className={onTagClicked && "pointer"}
                onClick={() => onTagClicked && onTagClicked(tag)}
              >
                <small>{tag}</small>
              </Label>
            ))}
          </LabelGroup>
        </JobTags>
      )}
      <JobComponents>
        <ComponentsListInJobRow components={job.components} />
      </JobComponents>
      <JobDate>
        <div>
          <span title={`Created at ${job.created_at}`}>
            <CalendarAltIcon className="pf-v5-u-mr-xs" />
            {formatDate(job.created_at)}
          </span>
        </div>
        <div className="pf-v5-u-mt-xs">
          {job.status === "new" ||
          job.status === "pre-run" ||
          job.status === "running" ? (
            <span title={`Job duration in seconds ${job.duration}`}>
              <ClockIcon className="pf-v5-u-mr-xs" />
              Started {startedSince}
            </span>
          ) : (
            <span title={`Job duration in seconds ${job.duration}`}>
              <ClockIcon className="pf-v5-u-mr-xs" />
              Ran for {jobDuration}
            </span>
          )}
        </div>
        {job.url !== null && (
          <div className="pf-v5-u-mt-xs">
            <LinkIcon className="pf-v5-u-mr-xs" />
            <a href={job.url}>{job.url}</a>
          </div>
        )}
        <div className="pf-v5-u-mt-xs">
          <span style={{ color: getColor(job.status) }}>
            <InfoCircleIcon className="pf-v5-u-mr-xs" />
            {`${job.status} ${
              job.status_reason !== null ? job.status_reason : ""
            }`}
          </span>
        </div>
        <JobComment className="pf-v5-u-mt-xs">
          <TextAreaEditableOnHover
            text={job.comment || ""}
            onSubmit={(comment) => {
              updateJob({
                ...job,
                comment,
              });
            }}
            style={{ minHeight: "25px" }}
          >
            <CommentBloc>
              <Markup content={convertLinksToHtml(job.comment)} />
            </CommentBloc>
          </TextAreaEditableOnHover>
        </JobComment>
      </JobDate>
      <JobNav isDark={isDark}>
        <JobLink to={`/jobs/${job.id}/jobStates`}>
          <CaretRightIcon />
        </JobLink>
      </JobNav>
      {job.results.length === 0 ? null : (
        <JobTests>
          {sortByOldestFirst(job.results).map((result, i) => (
            <LabelGroup
              categoryName={result.name}
              numLabels={5}
              key={i}
              className="pf-v5-u-mr-xs"
            >
              <TestLabels
                success={result.success}
                skips={result.skips}
                failures={result.failures}
                errors={result.errors}
                successfixes={result.successfixes}
                regressions={result.regressions}
              />
            </LabelGroup>
          ))}
        </JobTests>
      )}
      <Pad />
    </Job>
  );
}
