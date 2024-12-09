import { IJob, Filters, JobsTableListColumn } from "types";
import { Table, Thead, Tr, Th, Tbody } from "@patternfly/react-table";
import { groupJobsByPipeline } from "./pipelineJobs";
import JobsTableListRow from "./JobsTableListRow";
import { tableViewColumnLabels } from "jobs/toolbar/TableViewColumnsSelect";
import { styled } from "styled-components";
import { t_global_border_color_200 } from "@patternfly/react-tokens";

interface JobsTableListProps {
  jobs: IJob[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  columns: JobsTableListColumn[];
}

const TableWithTrStyled = styled(Table)`
  tbody > tr {
    &:last-child {
      border-bottom: 1px solid ${t_global_border_color_200.var} !important;
    }
  }
`;

export default function JobsTableList({
  jobs,
  filters,
  setFilters,
  columns,
}: JobsTableListProps) {
  if (jobs.length === 0) return null;
  const jobsGroupedByPipeline = groupJobsByPipeline(jobs);

  return (
    <TableWithTrStyled>
      <Thead>
        <Tr>
          <Th screenReaderText="pipeline"></Th>
          <Th>Name</Th>
          {columns.map((column, i) => (
            <Th key={i}>{tableViewColumnLabels[column]}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {jobsGroupedByPipeline.map((job) => (
          <JobsTableListRow
            key={`${job.id}:${job.etag}`}
            job={job}
            level={0}
            columns={columns}
            onStatusClicked={(status) => {
              setFilters({
                ...filters,
                status,
              });
            }}
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
            onPipelineClicked={(pipeline) => {
              setFilters({
                ...filters,
                pipeline_id: pipeline.id,
              });
            }}
          />
        ))}
      </Tbody>
    </TableWithTrStyled>
  );
}
