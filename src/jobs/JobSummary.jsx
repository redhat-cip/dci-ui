import React from "react";
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
} from "@patternfly/react-icons";
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

const Job = styled.div`
  width: 100%;
  display: block;
  min-height: 120px;
  background: ${(props) => getBackground(props.job.status)};
  display: grid;
  grid-template-columns: 80px repeat(2, 1fr) 50px;
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas:
    "a b b f"
    "a d e f";

  @media (min-width: 1281px) {
    display: grid;
    grid-template-columns: 80px repeat(5, 1fr) 80px;
    grid-template-rows: 1fr;
    grid-template-areas: "a b b c d e f";
  }

  &:focus-within {
    background: ${(props) =>
      getBackground(props.job.status, global_Color_light_200.value)};
  }
`;

const JobIcon = styled.div`
  grid-area: a;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 32px;
    height: 32px;
  }
`;

const JobDetails = styled.div`
  grid-area: b;
  padding: 1rem;
`;

const TopicName = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: ${global_primary_color_200.value};
  text-decoration: none;
`;

const JobId = styled.div`
  font-size: 16px;
  color: ${global_Color_400.value};
`;

const JobTests = styled.div`
  grid-area: c;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const JobComponents = styled.div`
  grid-area: d;
  padding: 1rem;
  color: ${global_Color_400.value};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const JobTest = styled.div`
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Regressions = ({ regressions, ...props }) => (
  <Label color="red" {...props}>
    <WarningTriangleIcon className="mr-xs" />
    <span>{`${regressions} regression${regressions > 1 ? "s" : ""}`}</span>
  </Label>
);

const Successfixes = ({ successfixes, ...props }) => (
  <Label color="green" {...props}>
    <ThumbsUpIcon className="mr-xs" />
    <span>{`${successfixes} fix${successfixes > 1 ? "es" : ""}`}</span>
  </Label>
);

const JobDuration = styled.div`
  grid-area: e;
  padding: 1rem;
  color: ${global_Color_400.value};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const JobLink = styled(Link)`
  grid-area: f;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${global_BackgroundColor_200.value};
  }
`;

const JobSummary = ({ job }) => {
  if (isEmpty(job)) return null;
  return (
    <Job job={job}>
      <JobIcon>{getIcon(job)}</JobIcon>
      <JobDetails>
        <TopicName tabIndex="-1" to={`/jobs/${job.id}/jobStates`}>
          {job.topic.name}
        </TopicName>
        <JobId>{job.id}</JobId>
        {isEmpty(job.team) ? null : (
          <div className="mt-xs">
            <UsersIcon className="mr-xs" />
            {job.team.name}
          </div>
        )}
        <div>
          <ServerIcon className="mr-xs" />
          {job.remoteci.name}
        </div>
        {isEmpty(job.tags) ? null : (
          <div className="mt-xs">
            {job.tags.map((tag, index) => (
              <Label key={index} color="blue" className="mr-xs mt-xs">
                <small>{tag}</small>
              </Label>
            ))}
          </div>
        )}
        {isEmpty(job.tag) ? null : (
          <div className="mt-xs">
            {job.tag.map((tag, index) => (
              <Label key={index} color="blue" className="mr-xs mt-xs">
                <small>{tag}</small>
              </Label>
            ))}
          </div>
        )}
      </JobDetails>
      <JobTests>
        {orderBy(job.results, [(test) => test.name.toLowerCase()]).map(
          (test) => (
            <JobTest key={test.id}>
              <Label
                color="green"
                title={`${test.success} tests in success`}
                className="mr-xs"
              >
                {test.success}
              </Label>
              <Label
                color="orange"
                title={`${test.skips} skipped tests`}
                className="mr-xs"
              >
                {test.skips}
              </Label>
              <Label
                color="red"
                title={`${
                  test.errors + test.failures
                } errors and failures tests`}
                className="mr-xs"
              >
                {test.errors + test.failures}
              </Label>
              <span className="mr-xs">{test.name}</span>
              <span>
                {test.successfixes ? (
                  <Successfixes
                    successfixes={test.successfixes}
                    className="mr-xs"
                  />
                ) : null}
                {test.regressions ? (
                  <Regressions regressions={test.regressions} />
                ) : null}
              </span>
            </JobTest>
          )
        )}
      </JobTests>
      <JobComponents>
        <div>
          {job.components.map((component) => (
            <div key={component.id} className="mt-xs">
              <CubesIcon /> {component.name}
            </div>
          ))}
        </div>
      </JobComponents>
      <JobDuration>
        <div>
          <span title={`Created at ${job.created_at}`}>
            <CalendarAltIcon className="mr-xs" />
            {job.datetime}
          </span>
        </div>
        {!isEmpty(job.humanizedDuration) &&
          job.status !== "new" &&
          job.status !== "pre-run" &&
          job.status !== "running" && (
            <div className="mt-xs">
              <span title={`Duration in seconds ${job.duration}`}>
                <ClockIcon className="mr-xs" />
                Ran for {job.humanizedDuration}
              </span>
            </div>
          )}
      </JobDuration>
      <JobLink to={`/jobs/${job.id}/jobStates`}>
        <CaretRightIcon />
      </JobLink>
    </Job>
  );
};

export default JobSummary;
