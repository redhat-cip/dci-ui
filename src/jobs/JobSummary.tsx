import React, { useState } from "react";
import { Label } from "@patternfly/react-core";
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
  CommentIcon,
} from "@patternfly/react-icons";
import styled from "styled-components";
import { IEnhancedJob } from "types";
import { formatDate, humanizeDuration } from "services/date";
import { isEmpty } from "lodash";
import { TextAreaEditableOnHover } from "ui";
import { Markup } from "interweave";
import { updateJobComment } from "./jobsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { convertLinksToHtml } from "./comment";

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
  padding: 0 1em;
  padding-bottom: 1em;
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
      "icon comment comment comment nav"
      "icon tag tag tag nav"
      "icon tests tests tests nav";
  }
`;

const JobIcon = styled.div`
  grid-area: icon;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  padding-left: 5px;
`;

function getIcon(status: string) {
  switch (status) {
    case "success":
      return (
        <CheckCircleIcon
          size="lg"
          style={{ color: global_success_color_100.value }}
        />
      );
    case "failure":
    case "error":
      return (
        <ExclamationCircleIcon
          size="lg"
          style={{ color: global_danger_color_100.value }}
        />
      );
    case "killed":
      return (
        <StopCircleIcon
          size="lg"
          style={{ color: global_warning_color_100.value }}
        />
      );
    default:
      return (
        <InProgressIcon
          size="lg"
          style={{ color: global_active_color_100.value }}
        />
      );
  }
}

const JobTitle = styled.div`
  grid-area: title;
  padding: 0 1em;
  padding-top: 1em;
`;

const TopicName: Link = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: ${global_primary_color_200.value};
  text-decoration: none;
`;

const JobId = styled.div`
  font-size: 14px;
  @media (min-width: 992px) {
    font-size: 16px;
  }

  color: ${global_Color_400.value};
`;

const JobComponents = styled.div`
  grid-area: components;
  padding: 0 1em;
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const JobDate = styled.div`
  grid-area: date;
  padding: 0 1em;
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const JobTag = styled.div`
  grid-area: tag;
  padding: 0 1em;
  padding-top: 0.5rem;
`;

const JobNav = styled.div`
  grid-area: nav;
  display: none;
  @media (min-width: 992px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const JobLink = styled(Link)`
  text-decoration: none;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  font-size: 1.2em;
  align-items: center;
  &:hover {
    background-color: ${global_BackgroundColor_200.value};
  }
`;

const JobTests = styled.div`
  grid-area: tests;
  display: flex;
  padding: 0 1em;
  padding-top: 1em;
  flex-direction: column;
  @media (min-width: 992px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const JobComment = styled.div`
  grid-area: comment;
  padding: 0 1em;
`;

const CommentBloc = styled.div`
  display: flex;
  align-items: center;
`;

interface RegressionsProps {
  regressions: number;
  [x: string]: any;
}

function Regressions({ regressions, ...props }: RegressionsProps) {
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
  return (
    <Label color="green" {...props}>
      <ThumbsUpIcon className="mr-xs" />
      <span>{`${successfixes} fix${successfixes > 1 ? "es" : ""}`}</span>
    </Label>
  );
}

interface JobSummaryProps {
  job: IEnhancedJob;
}

export default function JobSummary({ job }: JobSummaryProps) {
  const jobDuration = humanizeDuration(job.duration * 1000);
  const [innerJob, setInnerJob] = useState<IEnhancedJob>(job);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Job status={innerJob.status}>
      <JobIcon>{getIcon(innerJob.status)}</JobIcon>
      <JobTitle>
        <TopicName tabIndex={-1} to={`/jobs/${innerJob.id}/jobStates`}>
          {innerJob.topic?.name}
        </TopicName>
        <JobId>{innerJob.id}</JobId>
        <div className="mt-xs">
          <UsersIcon className="mr-xs" />
          {innerJob.team?.name}
        </div>
        <div>
          <ServerIcon className="mr-xs" />
          {innerJob.remoteci?.name}
        </div>
      </JobTitle>
      {isEmpty(innerJob.tags) ? null : (
        <JobTag>
          {innerJob.tags.map((tag, index) => (
            <Label key={index} color="blue" className="mr-xs mt-xs">
              <small>{tag}</small>
            </Label>
          ))}
        </JobTag>
      )}
      <JobComponents>
        <div>
          {innerJob.components.map((component) => (
            <div key={component.id} className="mt-xs">
              <CubesIcon /> {component.canonical_project_name || component.name}
            </div>
          ))}
        </div>
      </JobComponents>
      <JobDate>
        <div>
          <div>
            <span title={`Created at ${innerJob.created_at}`}>
              <CalendarAltIcon className="mr-xs" />
              {formatDate(innerJob.created_at)}
            </span>
          </div>
          {innerJob.status !== "new" &&
            innerJob.status !== "pre-run" &&
            innerJob.status !== "running" && (
              <div className="mt-xs">
                <span title={`Duration in seconds ${innerJob.duration}`}>
                  <ClockIcon className="mr-xs" />
                  Ran for {jobDuration}
                </span>
              </div>
            )}
        </div>
      </JobDate>
      <JobNav>
        <JobLink to={`/jobs/${innerJob.id}/jobStates`}>
          <CaretRightIcon />
        </JobLink>
      </JobNav>
      {isEmpty(innerJob.results) ? null : (
        <JobTests>
          {innerJob.results.map((result, i) => (
            <div key={i} className="mr-xl">
              <Label
                color="green"
                title={`${result.success} tests in success`}
                className="mr-xs"
              >
                {result.success}
              </Label>
              <Label
                color="orange"
                title={`${result.skips} skipped tests`}
                className="mr-xs"
              >
                {result.skips}
              </Label>
              <Label
                color="red"
                title={`${
                  result.errors + result.failures
                } errors and failures tests`}
                className="mr-xs"
              >
                {result.errors + result.failures}
              </Label>
              <span className="mr-xs">{result.name}</span>
              <span>
                {result.successfixes ? (
                  <Successfixes
                    successfixes={result.successfixes}
                    className="mr-xs"
                  />
                ) : null}
                {result.regressions ? (
                  <Regressions regressions={result.regressions} />
                ) : null}
              </span>
            </div>
          ))}
        </JobTests>
      )}
      <JobComment>
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
            <CommentIcon className="mr-xs" />
            <span style={{ color: global_Color_400.value }}>
              <Markup content={convertLinksToHtml(innerJob.comment)} />
            </span>
          </CommentBloc>
        </TextAreaEditableOnHover>
      </JobComment>
    </Job>
  );
}