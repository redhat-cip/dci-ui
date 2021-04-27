import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { Page } from "layout";
import feedersActions from "../feedersActions";
import CreateFeederForm from "./CreateFeederForm";
import { AppDispatch } from "store";
import { useHistory } from "react-router-dom";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { Breadcrumb } from "ui";

export default function CreateFeederPage() {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector(getTeams);
  const history = useHistory();

  useEffect(() => {
    dispatch(teamsActions.all());
  }, [dispatch]);

  return (
    <Page
      title="Create a feeder"
      description=""
      breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Create a feeder" }]}
        />
      }
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <CreateFeederForm
                teams={teams}
                onSubmit={(feeder) => {
                  dispatch(feedersActions.create(feeder)).then(() =>
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
