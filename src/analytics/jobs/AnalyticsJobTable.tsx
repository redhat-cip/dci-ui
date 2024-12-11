import { Card, CardBody } from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { JobStatusLabel } from "jobs/components";
import { Link } from "react-router-dom";
import { IAnalyticsJob } from "types";
import { humanizeJobDuration, JobComment, JobResults } from "./JobComponents";

export default function AnalyticsJobTable({
  jobs,
  ...props
}: {
  jobs: IAnalyticsJob[];
  [k: string]: any;
}) {
  return (
    <Card {...props}>
      <CardBody>
        <Table variant="compact">
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Name</Th>
              <Th>Team</Th>
              <Th>Pipeline</Th>
              <Th>Tests</Th>
              <Th>Comment</Th>
              <Th>Duration</Th>
              <Th>Created</Th>
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
                  <JobResults results={job.results} />
                </Td>
                <Td>
                  <JobComment
                    comment={job.comment}
                    status_reason={job.status_reason}
                  />
                </Td>
                <Td>{humanizeJobDuration(job.duration)}</Td>
                <Td>{job.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
