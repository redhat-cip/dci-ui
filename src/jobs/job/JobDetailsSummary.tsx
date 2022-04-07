import { useState } from "react";
import { Label, LabelGroup } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import {
  global_primary_color_200,
  global_Color_light_200,
  global_Color_400,
} from "@patternfly/react-tokens";
import {
  UsersIcon,
  ServerIcon,
  CubesIcon,
  ClockIcon,
  CalendarAltIcon,
  LinkIcon,
  InfoCircleIcon,
  AngleDoubleLeftIcon,
} from "@patternfly/react-icons";
import styled from "styled-components";
import { IEnhancedJob, IComponent, IRemoteci, ITeam, ITopic } from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { isEmpty } from "lodash";
import { TextAreaEditableOnHover, CopyIconButton } from "ui";
import { Markup } from "interweave";
import { updateJobComment } from "jobs/jobsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { sortByName } from "services/sort";
import { getTopicIcon } from "ui/icons";
import JobConfiguration from "jobs/jobSummary/JobConfiguration";
import {
  convertLinksToHtml,
  getBackground,
  getColor,
  getIcon,
} from "jobs/jobSummary/jobSummaryUtils";
import { Regressions, Successfixes } from "jobs/jobSummary/components";

const Job = styled.div`
  background: ${(props: { status: string }) => getBackground(props.status)};
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
    background: ${(props) =>
      getBackground(props.status, global_Color_light_200.value)};
  }

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 64px 1fr 1fr 1fr;
    grid-auto-rows: auto;
    grid-template-areas:
      "icon title components date"
      "icon tag tag tag"
      "icon tests tests tests"
      "icon pad pad pad";
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
  margin-top: 1em;
`;

const JobTests = styled.div`
  grid-area: tests;
  padding: 0.25em 1em;
  padding-bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 1em;
  @media (min-width: 992px) {
    flex-direction: row;
  }

  .pf-c-label-group__label {
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

const Component = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface ComponentsProps {
  components: IComponent[];
}

function Components({ components }: ComponentsProps) {
  const sortedComponents = sortByName(
    components.map((c) => ({ ...c, name: c.canonical_project_name || c.name }))
  );
  return (
    <div>
      {sortedComponents.map((component) => (
        <Component key={component.id} className="mt-xs">
          <Link to={`/topics/${component.topic_id}/components/${component.id}`}>
            <CubesIcon className="mr-xs" />
            {component.canonical_project_name || component.name}
          </Link>
        </Component>
      ))}
    </div>
  );
}

interface JobDetailsSummaryProps {
  job: IEnhancedJob;
  onTagClicked?: (tag: string) => void;
  onRemoteciClicked?: (remoteci: IRemoteci) => void;
  onTeamClicked?: (team: ITeam) => void;
  onTopicClicked?: (topic: ITopic) => void;
  onConfigurationClicked?: (configuration: string) => void;
}

export default function JobDetailsSummary({
  job,
  onTagClicked,
  onRemoteciClicked,
  onTeamClicked,
  onTopicClicked,
  onConfigurationClicked,
}: JobDetailsSummaryProps) {
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
        <JobId className="mt-xs">
          <CopyIconButton
            text={innerJob.id}
            textOnSuccess="copied"
            className="mr-xs pointer"
          />
          {innerJob.id}
        </JobId>
        <div className="mt-xs">
          <span
            role="button"
            tabIndex={0}
            className={onTeamClicked && "pointer"}
            onClick={() => onTeamClicked && onTeamClicked(innerJob.team)}
            onKeyDown={() => onTeamClicked && onTeamClicked(innerJob.team)}
          >
            <UsersIcon className="mr-xs" />
            {innerJob.team?.name}
          </span>
        </div>
        <div className="mt-xs">
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
            <ServerIcon className="mr-xs" />
            {innerJob.remoteci?.name}
          </span>
        </div>
        <div className="mt-xs">
          <span
            role="button"
            tabIndex={0}
            className={onTopicClicked && "pointer"}
            onClick={() => onTopicClicked && onTopicClicked(innerJob.topic)}
            onKeyDown={() => onTopicClicked && onTopicClicked(innerJob.topic)}
          >
            <TopicIcon className="mr-xs" />
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
      {isEmpty(innerJob.tags) ? null : (
        <JobTags>
          <LabelGroup numLabels={8}>
            {innerJob.tags.map((tag, index) => (
              <Label
                key={index}
                color="blue"
                className={onTagClicked === undefined ? "" : "pointer"}
                onClick={() =>
                  onTagClicked === undefined ? void 0 : onTagClicked(tag)
                }
              >
                <small>{tag}</small>
              </Label>
            ))}
          </LabelGroup>
        </JobTags>
      )}
      <JobComponents>
        <Components components={innerJob.components} />
      </JobComponents>
      <JobDate>
        <div>
          <span title={`Created at ${innerJob.created_at}`}>
            <CalendarAltIcon className="mr-xs" />
            {formatDate(innerJob.created_at)}
          </span>
        </div>
        <div className="mt-xs">
          {innerJob.status === "new" ||
          innerJob.status === "pre-run" ||
          innerJob.status === "running" ? (
            <span title={`Job duration in seconds ${innerJob.duration}`}>
              <ClockIcon className="mr-xs" />
              Started {startedSince}
            </span>
          ) : (
            <span title={`Job duration in seconds ${innerJob.duration}`}>
              <ClockIcon className="mr-xs" />
              Ran for {jobDuration}
            </span>
          )}
        </div>
        {innerJob.url !== null && (
          <div className="mt-xs">
            <LinkIcon className="mr-xs" />
            <a href={innerJob.url}>{innerJob.url}</a>
          </div>
        )}
        {innerJob.previous_job_id === null ? null : (
          <div
            className="mt-xs"
            style={{ display: "flex", alignItems: "center" }}
          >
            <AngleDoubleLeftIcon className="mr-xs" />
            <Link
              tabIndex={-1}
              to={`/jobs/${innerJob.previous_job_id}/jobStates`}
            >
              previous job
            </Link>
          </div>
        )}
        <div className="mt-xs">
          <span style={{ color: getColor(innerJob.status) }}>
            <InfoCircleIcon className="mr-xs" />
            {`${innerJob.status} ${
              innerJob.status_reason !== null ? innerJob.status_reason : ""
            }`}
          </span>
        </div>
        <JobComment className="mt-xs">
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
            style={{ minHeight: "25px" }}
          >
            <CommentBloc>
              <Markup content={convertLinksToHtml(innerJob.comment)} />
            </CommentBloc>
          </TextAreaEditableOnHover>
        </JobComment>
      </JobDate>
      {isEmpty(innerJob.results) ? null : (
        <JobTests>
          {innerJob.results.map((result, i) => (
            <LabelGroup
              categoryName={result.name}
              numLabels={5}
              key={i}
              className="mr-xs"
            >
              <Label
                isCompact
                color="green"
                title={`${result.success} tests in success`}
              >
                {result.success}
              </Label>
              <Label
                isCompact
                color="orange"
                title={`${result.skips} skipped tests`}
              >
                {result.skips}
              </Label>
              <Label
                isCompact
                color="red"
                title={`${
                  result.errors + result.failures
                } errors and failures tests`}
              >
                {result.errors + result.failures}
              </Label>
              <Successfixes successfixes={result.successfixes} isCompact />
              <Regressions regressions={result.regressions} isCompact />
            </LabelGroup>
          ))}
        </JobTests>
      )}
      <Pad />
    </Job>
  );
}
