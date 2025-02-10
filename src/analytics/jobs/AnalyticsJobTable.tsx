import { Card, CardBody } from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { JobStatusLabel } from "jobs/components";
import { Link } from "react-router";
import { IAnalyticsJob } from "types";
import { humanizeDuration } from "services/date";
import JobKeysValues from "jobs/components/JobKeysValues";

export default function AnalyticsJobTable({
  jobs,
  ...props
}: {
  jobs: IAnalyticsJob[];
  [key: string]: any;
}) {
  return (
    <Card {...props}>
      <CardBody>
        <Table variant="compact">
          <Thead>
            <Tr>
              <Th width={10}>Status</Th>
              <Th width={10}>Name</Th>
              <Th width={10}>Team</Th>
              <Th width={10}>Pipeline</Th>
              <Th width={30}>Key values</Th>
              <Th width={10}>Duration</Th>
              <Th width={20}>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jobs.map((job) => (
              <Tr key={job.id}>
                <Td>
                  <JobStatusLabel status={job.status} />
                </Td>
                <Td>
                  <Link to={`/jobs/${job.id}/jobStates`}>{job.name}</Link>
                </Td>
                <Td>
                  <Link to={`/teams/${job.team.id}`}>{job.team.name}</Link>
                </Td>
                <Td>{job.pipeline?.name}</Td>
                <Td>
                  <JobKeysValues keys_values={job.keys_values} />
                </Td>
                <Td>{humanizeDuration(job.duration)}</Td>
                <Td>{job.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
