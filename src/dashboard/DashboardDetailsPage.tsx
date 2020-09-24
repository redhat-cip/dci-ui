import React, { useEffect, useState } from "react";
import { Page } from "layout";
import { CardBody, Card, Grid, GridItem, Label } from "@patternfly/react-core";
import { useLocation, useRouteMatch, Link } from "react-router-dom";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { State, Stat } from "types";
import { Action } from "redux";
import { getStats } from "./dashboardActions";
import { LocationState } from "history";
import { EmptyState } from "ui";
import { fromNow } from "services/date";
import { global_palette_black_500 } from "@patternfly/react-tokens";
import { LinkIcon } from "@patternfly/react-icons";

type StatHeaderCardProps = {
  title: string;
  subTitle: string;
};

const StatHeaderCard = ({ title, subTitle }: StatHeaderCardProps) => {
  return (
    <Card>
      <CardBody>
        <p
          style={{
            color: global_palette_black_500.value,
            fontWeight: "bold",
          }}
        >
          {subTitle}
        </p>
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
};

type ListOfJobsCardProps = {
  stat: Stat | null;
};

const ListOfJobsCard = ({ stat }: ListOfJobsCardProps) => {
  if (stat === null) return null;
  return (
    <Card>
      <CardBody>
        <table
          className="pf-c-table pf-m-grid-md"
          role="grid"
          aria-label="Latest jobs per remoteci"
          id="latest-jobs-per-remoteci-table"
        >
          <caption>
            Latest jobs per remoteci using {stat.topic.name} topic
          </caption>
          <thead>
            <tr role="row">
              <th role="columnheader" scope="col">
                Team
              </th>
              <th role="columnheader" scope="col">
                Remote CI
              </th>
              <th className="text-center" role="columnheader" scope="col">
                Status
              </th>
              <th className="text-center" role="columnheader" scope="col">
                Job link
              </th>
              <th className="text-right" role="columnheader" scope="col">
                Last run
              </th>
            </tr>
          </thead>
          <tbody>
            {stat.jobs.map((job, i) => (
              <tr key={i} role="row">
                <td role="cell" data-label="Team name">
                  {job.team_name}
                </td>
                <td role="cell" data-label="Remoteci name">
                  {job.remoteci_name}
                </td>
                <td className="text-center" role="cell" data-label="Job status">
                  <Label color={job.status === "success" ? "green" : "red"}>
                    {job.status}
                  </Label>
                </td>
                <td className="text-center" role="cell" data-label="Job status">
                  <Link to={`/jobs/${job.id}/jobStates`}>
                    <LinkIcon />
                  </Link>
                </td>
                <td
                  className="text-right"
                  role="cell"
                  data-label="Job created at"
                >
                  <time title={job.created_at} dateTime={job.created_at}>
                    {fromNow(job.created_at)}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

type MatchParams = {
  topic_name: string;
};

const DashboardDetailPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation<LocationState>();
  const { state } = location;
  const [stat, setStat] = useState<Stat | null>((state as Stat) || null);
  const match = useRouteMatch<MatchParams>();
  const dispatch = useDispatch<ThunkDispatch<State, unknown, Action>>();
  const { topic_name } = match.params;

  useEffect(() => {
    if (isEmpty(stat)) {
      dispatch(getStats())
        .then((response) => {
          const stats = response.data.stats as Stat[];
          const s = stats.find((s) => s.topic.name === topic_name);
          if (s) {
            setStat(s);
          }
        })
        .catch(console.error)
        .then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <Page
      title={`Latest stats for ${topic_name}`}
      loading={isLoading && isEmpty(stat)}
      empty={!isLoading && isEmpty(stat)}
      EmptyComponent={
        <EmptyState
          title={`There is no stats for ${topic_name}`}
          info="Add some jobs to see some info for this topic"
        />
      }
    >
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
              title={fromNow(stat.jobs[0].created_at)}
              subTitle="Latest run"
            />
          )}
        </GridItem>
        <GridItem span={12}>
          <ListOfJobsCard stat={stat} />
        </GridItem>
      </Grid>
    </Page>
  );
};

export default DashboardDetailPage;
