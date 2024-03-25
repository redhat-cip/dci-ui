import { IJob, Filters, JobsTableListColumn } from "types";
import { Table, Thead, Tr, Th, Tbody } from "@patternfly/react-table";
import { groupJobsByPipeline } from "./pipelineJobs";
import JobsTableListRow from "./JobsTableListRow";
import { tableViewColumnLabels } from "jobs/toolbar/TableViewColumnsSelect";

interface JobsTableListProps {
  jobs: IJob[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  columns: JobsTableListColumn[];
}

export default function JobsTableList({
  jobs,
  filters,
  setFilters,
  columns,
}: JobsTableListProps) {
  if (jobs.length === 0) return null;
  const jobsGroupedByPipeline = groupJobsByPipeline(jobs);
  return (
    <Table className="pf-v5-c-table pf-m-compact pf-m-grid-md">
      <Thead>
        <Tr>
          <Th></Th>
          {columns.map((column, i) => (
            <Th key={i}>{tableViewColumnLabels[column]}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {jobsGroupedByPipeline.map((jobsInTheSamePipeline) =>
          jobsInTheSamePipeline.map((job, i, arr) => (
            <JobsTableListRow
              key={`${job.id}:${job.etag}`}
              isPipelineJob={arr.length > 1}
              isTheLastPipelineJob={arr.length - 1 === i}
              isPipelineRoot={i === 0}
              columns={columns}
              job={job}
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
            />
          )),
        )}
      </Tbody>
    </Table>
  );
}
