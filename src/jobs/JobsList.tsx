import React from "react";
import { global_Color_light_200 } from "@patternfly/react-tokens";
import styled from "styled-components";
import { isEmpty } from "lodash";
import JobSummary from "./JobSummary";
import { IEnhancedJob, IJobFilters } from "types";

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

interface JobsListProps {
  jobs: IEnhancedJob[];
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
}

export default function JobsList({ jobs, filters, setFilters }: JobsListProps) {
  if (isEmpty(jobs)) return null;
  return (
    <JobUl aria-label="job list">
      {jobs.map((job) => (
        <JobLi key={job.id}>
          <JobSummary
            job={job}
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
          />
        </JobLi>
      ))}
    </JobUl>
  );
}
