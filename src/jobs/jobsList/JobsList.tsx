import {
  global_Color_light_200,
  global_palette_red_50,
  global_danger_color_200,
} from "@patternfly/react-tokens";
import styled from "styled-components";
import { isEmpty } from "lodash";
import JobsListRow from "./JobsListRow";
import { IJob, Filters } from "types";
import { useTheme } from "ui/Theme/themeContext";
import { WarningTriangleIcon } from "@patternfly/react-icons";
import { Button } from "@patternfly/react-core";

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
  jobs: IJob[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  setTableViewActive: (isActive: boolean) => void;
}

export default function JobsList({
  jobs,
  filters,
  setFilters,
  setTableViewActive,
}: JobsListProps) {
  const { isDark } = useTheme();
  if (isEmpty(jobs)) return null;

  return (
    <JobUl aria-label="job list" isDark={isDark}>
      <li
        style={{
          backgroundColor: global_palette_red_50.value,
          color: global_danger_color_200.value,
          padding: "1em",
        }}
      >
        <WarningTriangleIcon className="pf-v5-u-mr-xs" />
        Deprecation warning: This representation of the jobs list is deprecated
        and will be removed soon. To use the new view{" "}
        <Button
          size="sm"
          className="pf-v5-u-ml-xs"
          type="button"
          onClick={() => setTableViewActive(true)}
        >
          click here
        </Button>
      </li>
      {jobs.map((job) => (
        <JobLi key={job.id} isDark={isDark}>
          <JobsListRow
            job={job}
            onTagClicked={(tag) => {
              const tags = filters.tags ?? [];
              setFilters({
                ...filters,
                tags: [...tags, tag],
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
                configuration,
              });
            }}
          />
        </JobLi>
      ))}
    </JobUl>
  );
}
