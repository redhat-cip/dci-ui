import React from "react";
import { Link } from "react-router-dom";
import { Label } from "@patternfly/react-core";
import {
  global_danger_color_100,
  global_success_color_100,
  global_active_color_100,
  global_warning_color_100,
  global_Color_light_100,
  global_Color_light_200,
  global_primary_color_100,
  global_Color_100,
  global_Color_200,
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
} from "@patternfly/react-icons";
import { TextRed, TextGreen, Labels } from "../ui";
import styled from "styled-components";
import { isEmpty, orderBy } from "lodash";

function getBackground(status, backgroundColor = global_Color_light_100.value) {
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

const JobUl = styled.ul`
  border: 1px solid ${global_Color_light_200.value};
  padding: 0;
  margin: 0;
`;

const JobLi = styled.li`
  border-top: 1px solid ${global_Color_light_200.value};
  &:first-child {
    border-top: none;
  }

  padding: 0;
  margin: 0;
`;

function getIcon(job) {
  switch (job.status) {
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

const JobLink = styled(Link)`
  display: block;
  padding: 0;
  margin: 0;
  text-decoration: none;
  color: inherit;
  background: ${(props) => getBackground(props.job.status)};
  &:hover,
  &:focus {
    background: ${(props) =>
      getBackground(props.job.status, global_Color_light_200.value)};
  }
`;

const InnerJobLink = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const JobContent = styled.div`
  min-width: 0;
  flex: 1 1 0%;
  display: flex;
  align-items: center;
`;

const JobIcon = styled.div`
  flex-shrink: 0;
`;
const JobDetails = styled.div`
  min-width:0
  flex: 1 1 0%;
  padding-left: 1rem;
  padding-right: 1rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
    display: grid;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  @media (min-width: 1281px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const JobTests = styled.div`
  display: none;
  @media (min-width: 1281px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const JobName = styled.div`
  color: ${global_primary_color_100.value};
`;

const JobId = styled.p`
  color: ${global_Color_200.value};
`;

const JobTimeDetails = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${global_Color_100.value};
  }
`;

const JobComponents = styled.div`
  color: ${global_Color_200.value};
`;

const Regressions = ({ regressions }) => (
  <TextRed>
    <WarningTriangleIcon
      color={global_danger_color_100.value}
      className="mr-xs"
    />
    <span>{`${regressions} regression${regressions > 1 ? "s" : ""}`}</span>
  </TextRed>
);

const Successfixes = ({ successfixes }) => (
  <TextGreen>
    <ThumbsUpIcon color={global_success_color_100.value} className="mr-xs" />
    <span>{`${successfixes} fix${successfixes > 1 ? "es" : ""}`}</span>
  </TextGreen>
);
const JobTest = styled.div`
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const JobSummary = ({ job }) => (
  <JobContent>
    <JobIcon>{getIcon(job)}</JobIcon>
    <JobDetails>
      <div>
        <JobName>{job.topic.name}</JobName>
        <JobId>{job.id}</JobId>
        {isEmpty(job.team) ? null : (
          <p>
            <UsersIcon className="mr-xs" />
            {job.team.name}
          </p>
        )}
        <p>
          <ServerIcon className="mr-xs" />
          {job.remoteci.name}
        </p>
        {isEmpty(job.tags) ? null : (
          <p>
            {job.tags.map((tag, index) => (
              <Label key={index} isCompact className="mr-xs mt-xs">
                {tag}
              </Label>
            ))}
          </p>
        )}
        {isEmpty(job.tag) ? null : (
          <p>
            {job.tag.map((tag, index) => (
              <Label key={index} isCompact className="mr-xs mt-xs">
                {tag}
              </Label>
            ))}
          </p>
        )}
      </div>
      <JobTimeDetails>
        <p>
          <span title={`Created at ${job.created_at}`}>
            <CalendarAltIcon className="mr-xs" />
            {job.datetime}
          </span>
        </p>
        {!isEmpty(job.humanizedDuration) &&
          job.status !== "new" &&
          job.status !== "pre-run" &&
          job.status !== "running" && (
            <p>
              <span title={`Duration in seconds ${job.duration}`}>
                <ClockIcon className="mr-xs" />
                Ran for {job.humanizedDuration}
              </span>
            </p>
          )}
        <JobComponents className="mt-xs">
          {job.components.map((component) => (
            <p key={component.id}>
              <CubesIcon /> {component.name}
            </p>
          ))}
        </JobComponents>
      </JobTimeDetails>
      <JobTests>
        {orderBy(job.results, [(test) => test.name.toLowerCase()]).map(
          (test) => (
            <JobTest key={test.id}>
              <Labels.Success
                title={`${test.success} tests in success`}
                className="mr-xs"
              >
                {test.success}
              </Labels.Success>
              <Labels.Warning
                title={`${test.skips} skipped tests`}
                className="mr-xs"
              >
                {test.skips}
              </Labels.Warning>
              <Labels.Error
                title={`${test.errors +
                  test.failures} errors and failures tests`}
                className="mr-xs"
              >
                {test.errors + test.failures}
              </Labels.Error>
              <span>
                {test.name}
                {test.successfixes ? (
                  <Successfixes successfixes={test.successfixes} />
                ) : null}
                {test.regressions ? (
                  <Regressions regressions={test.regressions} />
                ) : null}
              </span>
            </JobTest>
          )
        )}
      </JobTests>
    </JobDetails>
  </JobContent>
);

const JobsList = ({ jobs }) => {
  if (isEmpty(jobs)) return null;
  return (
    <JobUl aria-label="job list">
      {jobs.map((job, i) => (
        <JobLi key={job.id}>
          <JobLink to={`/jobs/${job.id}/jobStates`} job={job}>
            <InnerJobLink>
              <JobSummary job={job} />
              <div>
                <CaretRightIcon />
              </div>
            </InnerJobLink>
          </JobLink>
        </JobLi>
      ))}
    </JobUl>
  );
};

export default JobsList;
