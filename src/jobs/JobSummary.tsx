import { useState } from "react";
import { Label, Chip } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import {
  global_danger_color_100,
  global_success_color_100,
  global_active_color_100,
  global_warning_color_100,
  global_primary_color_200,
  global_BackgroundColor_200,
  global_Color_light_100,
  global_Color_light_200,
  global_Color_400,
} from "@patternfly/react-tokens";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  BugIcon,
  StopCircleIcon,
  InProgressIcon,
  UsersIcon,
  ServerIcon,
  CubesIcon,
  ClockIcon,
  CalendarAltIcon,
  WarningTriangleIcon,
  ThumbsUpIcon,
  CaretRightIcon,
  CogIcon,
  LinkIcon,
  InfoCircleIcon,
} from "@patternfly/react-icons";
import styled from "styled-components";
import { IEnhancedJob, IComponent, IRemoteci, ITeam, ITopic } from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { isEmpty } from "lodash";
import { TextAreaEditableOnHover, CopyIconButton } from "ui";
import { Markup } from "interweave";
import { updateJobComment } from "./jobsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { convertLinksToHtml } from "./comment";
import { sortByName } from "services/sort";
import { getTopicIcon } from "ui/icons";

function getBackground(
  status: string,
  backgroundColor: string = global_Color_light_100.value
) {
  switch (status) {
    case "success":
      return `linear-gradient(to right,${global_success_color_100.value} 0,${global_success_color_100.value} 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "failure":
    case "error":
      return `linear-gradient(to right,${global_danger_color_100.value} 0,${global_danger_color_100.value} 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "killed":
      return `linear-gradient(to right,${global_warning_color_100.value} 0,${global_warning_color_100.value} 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    default:
      return `linear-gradient(to right,${global_active_color_100.value} 0,${global_active_color_100.value} 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
  }
}

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
    grid-template-columns: 64px 1fr 1fr 1fr 64px;
    grid-auto-rows: auto;
    grid-template-areas:
      "icon title components date nav"
      "icon tag tag tag nav"
      "icon tests tests tests nav";
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

function getIcon(status: string) {
  switch (status) {
    case "success":
      return <CheckCircleIcon />;
    case "failure":
      return <BugIcon />;
    case "error":
      return <ExclamationCircleIcon />;
    case "killed":
      return <StopCircleIcon />;
    default:
      return <InProgressIcon />;
  }
}

function getColor(status: string) {
  switch (status) {
    case "success":
      return global_success_color_100.value;
    case "failure":
      return global_danger_color_100.value;
    case "error":
      return global_danger_color_100.value;
    case "killed":
      return global_warning_color_100.value;
    default:
      return global_active_color_100.value;
  }
}

const JobTitle = styled.div`
  grid-area: title;
  padding: 1em;
  overflow: hidden;
`;

const TopicName: Link = styled(Link)`
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
  overflow: hidden;
`;

const JobDate = styled.div`
  grid-area: date;
  padding: 1em;
`;

const JobTag = styled.div`
  grid-area: tag;
  padding: 1em;
  padding-top: 0;
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
  padding: 1em 0;
  padding-top: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

const JobTest = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-familly: monospace;
  margin: 0 1em;
  &:first-child {
  }
  &:last-child {
  }
`;

const JobComment = styled.div``;

const CommentBloc = styled.div`
  display: flex;
  align-items: center;
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
  const [showMore, setShowMore] = useState(false);
  const maxNumberElements = Math.min(3, components.length);
  const showMoreButton = components.length > maxNumberElements;
  const sortedComponents = sortByName(
    components.map((c) => ({ ...c, name: c.canonical_project_name || c.name }))
  );
  const nFirstComponents = sortedComponents.slice(0, maxNumberElements);
  const remainingComponents = sortedComponents.slice(maxNumberElements);
  return (
    <div>
      {nFirstComponents.map((component) => (
        <Component key={component.id} className="mt-xs">
          <Link to={`/topics/${component.topic_id}/components/${component.id}`}>
            <CubesIcon className="mr-xs" />
            {component.canonical_project_name || component.name}
          </Link>
        </Component>
      ))}
      {showMore ? (
        <>
          {remainingComponents.map((component) => (
            <Component key={component.id} className="mt-xs">
              <Link
                to={`/topics/${component.topic_id}/components/${component.id}`}
              >
                <CubesIcon className="mr-xs" />
                {component.canonical_project_name || component.name}
              </Link>
            </Component>
          ))}
          <Chip
            component="button"
            onClick={() => setShowMore(false)}
            isOverflowChip
            className="mt-xs"
          >
            show less
          </Chip>
        </>
      ) : (
        showMoreButton && (
          <Chip
            component="button"
            onClick={() => setShowMore(true)}
            isOverflowChip
            className="mt-xs"
          >
            {remainingComponents.length} more
          </Chip>
        )
      )}
    </div>
  );
}

interface RegressionsProps {
  regressions: number;
  [x: string]: any;
}

function Regressions({ regressions, ...props }: RegressionsProps) {
  if (regressions === 0) {
    return null;
  }
  return (
    <Label color="red" {...props}>
      <WarningTriangleIcon className="mr-xs" />
      <span>{`${regressions} regression${regressions > 1 ? "s" : ""}`}</span>
    </Label>
  );
}

interface SuccessfixesProps {
  successfixes: number;
  [x: string]: any;
}

function Successfixes({ successfixes, ...props }: SuccessfixesProps) {
  if (successfixes === 0) {
    return null;
  }
  return (
    <Label color="green" {...props}>
      <ThumbsUpIcon className="mr-xs" />
      <span>{`${successfixes} fix${successfixes > 1 ? "es" : ""}`}</span>
    </Label>
  );
}

interface JobSummaryProps {
  job: IEnhancedJob;
  onTagClicked?: (tag: string) => void;
  onRemoteciClicked?: (remoteci: IRemoteci) => void;
  onTeamClicked?: (team: ITeam) => void;
  onTopicClicked?: (topic: ITopic) => void;
}

export default function JobSummary({
  job,
  onTagClicked,
  onRemoteciClicked,
  onTeamClicked,
  onTopicClicked,
}: JobSummaryProps) {
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
        {innerJob.configuration !== null && (
          <div className="mt-xs">
            <CogIcon className="mr-xs" />
            {innerJob.configuration}
          </div>
        )}
      </JobTitle>
      {isEmpty(innerJob.tags) ? null : (
        <JobTag>
          {innerJob.tags.map((tag, index) => (
            <Label
              key={index}
              color="blue"
              className={`mr-xs mt-xs ${
                onTagClicked === undefined ? "" : "pointer"
              }`}
              onClick={() =>
                onTagClicked === undefined ? void 0 : onTagClicked(tag)
              }
            >
              <small>{tag}</small>
            </Label>
          ))}
        </JobTag>
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
      <JobNav>
        <JobLink to={`/jobs/${innerJob.id}/jobStates`}>
          <CaretRightIcon />
        </JobLink>
      </JobNav>
      {isEmpty(innerJob.results) ? null : (
        <JobTests>
          {innerJob.results.map((result, i) => (
            <JobTest key={i}>
              <Label color="green" title={`${result.success} tests in success`}>
                {result.success}
              </Label>
              <Successfixes successfixes={result.successfixes} />
              <Label color="orange" title={`${result.skips} skipped tests`}>
                {result.skips}
              </Label>
              <Label
                color="red"
                title={`${
                  result.errors + result.failures
                } errors and failures tests`}
              >
                {result.errors + result.failures}
              </Label>
              <Regressions regressions={result.regressions} />
              <span className="ml-xs mr-xs">{result.name}</span>
            </JobTest>
          ))}
        </JobTests>
      )}
    </Job>
  );
}
