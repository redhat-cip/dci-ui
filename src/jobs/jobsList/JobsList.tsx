import { global_Color_light_200 } from "@patternfly/react-tokens";
import styled from "styled-components";
import { isEmpty } from "lodash";
import JobsListRow from "./JobsListRow";
import { IEnhancedJob, IJobFilters } from "types";
import { useTheme } from "ui/Theme/themeContext";

const JobUl = styled.ul<{ isDark: boolean }>`
  border: 1px solid
    ${({ isDark }) => (isDark ? "#444548" : global_Color_light_200.value)};
  padding: 0;
  margin: 0;
`;

const JobLi = styled.li<{ isDark: boolean }>`
  border-top: 1px solid
    ${({ isDark }) => (isDark ? "#444548" : global_Color_light_200.value)};
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
  const { isDark } = useTheme();
  if (isEmpty(jobs)) return null;
  return (
    <JobUl aria-label="job list" isDark={isDark}>
      {jobs.map((job) => (
        <JobLi key={job.id} isDark={isDark}>
          <JobsListRow
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
            onTopicClicked={(topic) => {
              setFilters({
                ...filters,
                topic_id: topic.id,
              });
            }}
            onConfigurationClicked={(configuration) => {
              setFilters({
                ...filters,
                configuration: configuration,
              });
            }}
          />
        </JobLi>
      ))}
    </JobUl>
  );
}
