import { useState } from "react";
import { Label, LabelGroup } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import {
  global_primary_color_200,
  global_BackgroundColor_200,
  global_Color_light_200,
  global_Color_400,
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
import { IEnhancedJob, IRemoteci, ITeam, ITopic } from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { CopyIconButton } from "ui";
import TextAreaEditableOnHover from "./TextAreaEditableOnHover";
import { Markup } from "interweave";
import { updateJobComment } from "../jobsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
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

const Job = styled.div<{ status: string }>`
  background: ${({ status }) => getBackground(status)};
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
    background: ${({ status }) =>
      getBackground(status, global_Color_light_200.value)};
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
  color: ${global_primary_color_200.value};
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

const JobNav = styled.div`
  grid-area: nav;
  display: none;
  border-left: 1px dashed ${global_BackgroundColor_200.value};
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
  job: IEnhancedJob;
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
  const jobDuration = humanizeDuration(job.duration * 1000);
  const startedSince = fromNow(job.created_at);
  const [innerJob, setInnerJob] = useState<IEnhancedJob>(job);
  const dispatch = useDispatch<AppDispatch>();
  const TopicIcon = getTopicIcon(innerJob.topic?.name);
  return (
    <Job status={innerJob.status}>
      <JobIcon title={`job status ${innerJob.status}`}>
        <span style={{ color: getColor(innerJob.status), fontSize: "2em" }}>
          {getIcon(innerJob.status)}
        </span>
      </JobIcon>
      <JobTitle>
        <TopicName tabIndex={-1} to={`/jobs/${innerJob.id}/jobStates`}>
          {innerJob.name || innerJob.topic?.name}
        </TopicName>
        <JobId className="pf-v5-u-mt-xs">
          <CopyIconButton
            text={innerJob.id}
            textOnSuccess="copied"
            className="pf-v5-u-mr-xs pointer"
          />
          {innerJob.id}
        </JobId>
        <div className="pf-v5-u-mt-xs">
          <span
            role="button"
            tabIndex={0}
            className={onTeamClicked && "pointer"}
            onClick={() => onTeamClicked && onTeamClicked(innerJob.team)}
            onKeyDown={() => onTeamClicked && onTeamClicked(innerJob.team)}
          >
            <UsersIcon className="pf-v5-u-mr-xs" />
            {innerJob.team?.name}
          </span>
        </div>
        <div className="pf-v5-u-mt-xs">
          <span
            role="button"
            tabIndex={0}
            className={onRemoteciClicked && "pointer"}
            onClick={() =>
              onRemoteciClicked && onRemoteciClicked(innerJob.remoteci)
            }
            onKeyDown={() =>
              onRemoteciClicked && onRemoteciClicked(innerJob.remoteci)
            }
          >
            <ServerIcon className="pf-v5-u-mr-xs" />
            {innerJob.remoteci?.name}
          </span>
        </div>
        <div className="pf-v5-u-mt-xs">
          <span
            role="button"
            tabIndex={0}
            className={onTopicClicked && "pointer"}
            onClick={() => onTopicClicked && onTopicClicked(innerJob.topic)}
            onKeyDown={() => onTopicClicked && onTopicClicked(innerJob.topic)}
          >
            <TopicIcon className="pf-v5-u-mr-xs" />
            {innerJob.topic?.name}
          </span>
        </div>
        {innerJob.configuration === null ? null : (
          <JobConfiguration
            configuration={innerJob.configuration}
            onClick={onConfigurationClicked}
          />
        )}
      </JobTitle>
      {innerJob.tags?.length === 0 ? null : (
        <JobTags>
          <LabelGroup numLabels={8}>
            {innerJob.tags?.map((tag, index) => (
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
        <ComponentsListInJobRow components={innerJob.components} />
      </JobComponents>
      <JobDate>
        <div>
          <span title={`Created at ${innerJob.created_at}`}>
            <CalendarAltIcon className="pf-v5-u-mr-xs" />
            {formatDate(innerJob.created_at)}
          </span>
        </div>
        <div className="pf-v5-u-mt-xs">
          {innerJob.status === "new" ||
          innerJob.status === "pre-run" ||
          innerJob.status === "running" ? (
            <span title={`Job duration in seconds ${innerJob.duration}`}>
              <ClockIcon className="pf-v5-u-mr-xs" />
              Started {startedSince}
            </span>
          ) : (
            <span title={`Job duration in seconds ${innerJob.duration}`}>
              <ClockIcon className="pf-v5-u-mr-xs" />
              Ran for {jobDuration}
            </span>
          )}
        </div>
        {innerJob.url !== null && (
          <div className="pf-v5-u-mt-xs">
            <LinkIcon className="pf-v5-u-mr-xs" />
            <a href={innerJob.url}>{innerJob.url}</a>
          </div>
        )}
        <div className="pf-v5-u-mt-xs">
          <span style={{ color: getColor(innerJob.status) }}>
            <InfoCircleIcon className="pf-v5-u-mr-xs" />
            {`${innerJob.status} ${
              innerJob.status_reason !== null ? innerJob.status_reason : ""
            }`}
          </span>
        </div>
        <JobComment className="pf-v5-u-mt-xs">
          <TextAreaEditableOnHover
            text={innerJob.comment || ""}
            onSubmit={(comment) => {
              dispatch(
                updateJobComment({
                  ...innerJob,
                  comment,
                }),
              ).then(setInnerJob);
            }}
            style={{ minHeight: "25px" }}
          >
            <CommentBloc>
              <Markup content={convertLinksToHtml(innerJob.comment)} />
            </CommentBloc>
          </TextAreaEditableOnHover>
        </JobComment>
      </JobDate>
      <JobNav>
        <JobLink to={`/jobs/${innerJob.id}/jobStates`}>
          <CaretRightIcon />
        </JobLink>
      </JobNav>
      {innerJob.results.length === 0 ? null : (
        <JobTests>
          {sortByOldestFirst(innerJob.results).map((result, i) => (
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
