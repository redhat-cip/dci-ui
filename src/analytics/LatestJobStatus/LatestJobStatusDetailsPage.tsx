import { useEffect } from "react";
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
import { useLazyGetStatsQuery } from "./latestJobStatusApi";

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
          id="latest-jobs-per-remoteci-table"
          aria-label="Latest Latest Jobs Status"
        >
          <Caption>
            Latest Latest Jobs Status using {stat.topic.name} topic
          </Caption>
          <Thead>
            <Tr>
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
              <Tr key={i}>
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

function LatestJobStatusDetails({ topic_name }: { topic_name: string }) {
  const [getStats, { data: products, isLoading }] = useLazyGetStatsQuery();

  useEffect(() => {
    getStats();
  }, [getStats]);

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!products) {
    return (
      <EmptyState
        title="There is no stats"
        info="Add some jobs to see some info for this topic"
      />
    );
  }

  const stat = products
    .flatMap((product) => product.stats)
    .find((stat) => stat.topic.name === topic_name);

  if (!stat) {
    return (
      <EmptyState
        title={`There is no stats for ${topic_name}`}
        info="Add some jobs to see some info for this topic"
      />
    );
  }

  return (
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
  );
}

export default function LatestJobStatusDetailsPage() {
  const { topic_name } = useParams();
  if (!topic_name) return null;

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
      <LatestJobStatusDetails topic_name={topic_name} />
    </PageSection>
  );
}
