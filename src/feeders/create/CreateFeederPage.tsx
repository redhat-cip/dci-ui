import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import feedersActions from "../feedersActions";
import CreateFeederForm from "./CreateFeederForm";
import { AppDispatch } from "store";
import { useNavigate } from "react-router-dom";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { Breadcrumb } from "ui";

export default function CreateFeederPage() {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector(getTeams);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(teamsActions.all());
  }, [dispatch]);

  return (
    <MainPage
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
                    navigate("/feeders")
                  );
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </MainPage>
  );
}
