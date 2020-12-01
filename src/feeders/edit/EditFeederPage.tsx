import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { LoadingPage, Page } from "layout";
import feedersActions from "../feedersActions";
import EditFeederForm from "./EditFeederForm";
import { AppDispatch } from "store";
import { useHistory, useParams } from "react-router-dom";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { IFeeder } from "types";

interface MatchParams {
  id: string;
}

export default function EditFeederPage() {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector(getTeams);
  const history = useHistory();
  const { id } = useParams<MatchParams>();
  const [feeder, setFeeder] = useState<IFeeder | null>(null);

  useEffect(() => {
    dispatch(teamsActions.all());
    dispatch(feedersActions.one(id)).then((response) => {
      setFeeder(response.data.feeder);
    });
  }, [dispatch, id]);

  if (feeder === null) return <LoadingPage title="Edit a feeder" />;

  return (
    <Page title="Edit a feeder">
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <EditFeederForm
                feeder={feeder}
                teams={teams}
                onSubmit={(feeder) => {
                  dispatch(feedersActions.update(feeder)).then(() =>
                    history.push("/feeders")
                  );
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Page>
  );
}
