import React from "react";
import { Label } from "@patternfly/react-core";
import {
  global_danger_color_100,
  global_success_color_100,
  global_active_color_100,
  global_warning_color_100,
  global_primary_color_200,
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
} from "@patternfly/react-icons";
import styled from "styled-components";
import { isEmpty, orderBy } from "lodash";

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
  color: ${global_primary_color_200.value};
`;

const JobTimeDetails = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
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
        <p>{job.id}</p>
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
              <Label key={index} color="blue" className="mr-xs mt-xs">
                {tag}
              </Label>
            ))}
          </p>
        )}
        {isEmpty(job.tag) ? null : (
          <p>
            {job.tag.map((tag, index) => (
              <Label key={index} color="blue" className="mr-xs mt-xs">
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
        <div className="mt-xs">
          {job.components.map((component) => (
            <p key={component.id}>
              <CubesIcon /> {component.name}
            </p>
          ))}
        </div>
      </JobTimeDetails>
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
    </JobDetails>
  </JobContent>
);

export default JobSummary;
