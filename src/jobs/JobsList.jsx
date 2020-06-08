import React from "react";
import { Link } from "react-router-dom";
import {
  global_danger_color_100,
  global_success_color_100,
  global_active_color_100,
  global_warning_color_100,
  global_Color_light_100,
  global_Color_light_200,
} from "@patternfly/react-tokens";
import { CaretRightIcon } from "@patternfly/react-icons";
import styled from "styled-components";
import { isEmpty } from "lodash";
import JobSummary from "./JobSummary";

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
