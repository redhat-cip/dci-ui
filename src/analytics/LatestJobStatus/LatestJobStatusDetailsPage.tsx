import { useEffect, useState } from "react";
import {
  CardBody,
  Card,
  Grid,
  GridItem,
  Label,
  Content,
  ContentVariants,
  PageSection,
} from "@patternfly/react-core";
import { useParams, Link } from "react-router-dom";
import { IStat } from "types";
import { getStat } from "./latestJobStatusActions";
import { EmptyState, Breadcrumb } from "ui";
import { fromNow } from "services/date";
import { LinkIcon } from "@patternfly/react-icons";
import {
  Table,
  Caption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";
import LoadingPageSection from "ui/LoadingPageSection";

type StatHeaderCardProps = {
  title: string;
  subTitle: string;
};

export function StatHeaderCard({ title, subTitle }: StatHeaderCardProps) {
  return (
    <Card>
      <CardBody>
        <Content component={ContentVariants.h6}>{subTitle}</Content>
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            lineHeight: "2.25rem",
          }}
        >
          {title}
        </h1>
      </CardBody>
    </Card>
  );
}

type ListOfJobsCardProps = {
  stat: IStat | null;
};

function ListOfJobsCard({ stat }: ListOfJobsCardProps) {
  if (stat === null) return null;
  return (
    <Card>
      <CardBody>
        <Table
          className="pf-v6-c-table pf-m-grid-md"
          role="grid"
          aria-label="Latest Latest Jobs Status"
          id="latest-jobs-per-remoteci-table"
        >
          <Caption>
            Latest Latest Jobs Status using {stat.topic.name} topic
          </Caption>
          <Thead>
            <Tr role="row">
              <Th role="columnheader" scope="col">
                Team
              </Th>
              <Th role="columnheader" scope="col">
                Remote CI
              </Th>
              <Th className="text-center" role="columnheader" scope="col">
                Status
              </Th>
              <Th className="text-center" role="columnheader" scope="col">
                Job link
              </Th>
              <Th className="text-right" role="columnheader" scope="col">
                Started
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {stat.jobs.map((job, i) => (
              <Tr key={i} role="row">
                <Td role="cell" data-label="Team name">
                  {job.team_name}
                </Td>
                <Td role="cell" data-label="Remoteci name">
                  {job.remoteci_name}
                </Td>
                <Td className="text-center" role="cell" data-label="Job status">
                  <Label color={job.status === "success" ? "green" : "red"}>
                    {job.status}
                  </Label>
                </Td>
                <Td className="text-center" role="cell" data-label="Job status">
                  <Link to={`/jobs/${job.id}/jobStates`}>
                    <LinkIcon />
                  </Link>
                </Td>
                <Td
                  className="text-right"
                  role="cell"
                  data-label="Job created at"
                >
                  <time title={job.created_at} dateTime={job.created_at}>
                    {fromNow(job.created_at)}
                  </time>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default function LatestJobStatusDetailsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stat, setStat] = useState<IStat | null>(null);
  const { topic_name } = useParams();

  useEffect(() => {
    if (topic_name) {
      getStat(topic_name)
        .then(setStat)
        .catch(console.error)
        .then(() => setIsLoading(false));
    }
  }, [topic_name]);

  if (!topic_name) return null;

  if (isLoading) {
    return <LoadingPageSection />;
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          {
            to: "/analytics/latest_jobs_status",
            title: "Latest Jobs Status",
          },
          { title: topic_name },
        ]}
      />
      <Content component="h1">{`Latest stats for ${topic_name}`}</Content>
      {stat === null ? (
        <EmptyState
          title={`There is no stats for ${topic_name}`}
          info="Add some jobs to see some info for this topic"
        />
      ) : (
        <Grid hasGutter>
          <GridItem span={4}>
            {stat && (
              <StatHeaderCard
                title={stat.nbOfJobs.toString()}
                subTitle="Number of jobs"
              />
            )}
          </GridItem>
          <GridItem span={4}>
            {stat && (
              <StatHeaderCard
                title={`${stat.percentageOfSuccess}%`}
                subTitle="Percentage of successful jobs"
              />
            )}
          </GridItem>
          <GridItem span={4}>
            {stat && (
              <StatHeaderCard
                title={fromNow(stat.jobs[0].created_at) || ""}
                subTitle="Latest run"
              />
            )}
          </GridItem>
          <GridItem span={12}>
            <ListOfJobsCard stat={stat} />
          </GridItem>
        </Grid>
      )}
    </PageSection>
  );
}
