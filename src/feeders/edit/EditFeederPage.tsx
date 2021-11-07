import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { LoadingPage, Page } from "layout";
import feedersActions from "../feedersActions";
import EditFeederForm from "./EditFeederForm";
import { AppDispatch } from "store";
import { useNavigate, useParams } from "react-router-dom";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { IFeeder } from "types";
import { Breadcrumb } from "ui";

export default function EditFeederPage() {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector(getTeams);
  const navigate = useNavigate();
  const [feeder, setFeeder] = useState<IFeeder | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(teamsActions.all());
      dispatch(feedersActions.one(id)).then((response) => {
        setFeeder(response.data.feeder);
      });
    }
  }, [dispatch, id]);

  if (!id) return null;

  const breadcrumb = (
    <Breadcrumb
      links={[
        { to: "/", title: "DCI" },
        { to: "/feeders", title: "Feeders" },
        { to: `/feeders/${id}`, title: id },
      ]}
    />
  );

  if (feeder === null)
    return <LoadingPage title="Edit a feeder" breadcrumb={breadcrumb} />;

  return (
    <Page
      title="Edit a feeder"
      description="A feeder is a script in charge of uploading newer versions of components to the control server."
      breadcrumb={breadcrumb}
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <EditFeederForm
                feeder={feeder}
                teams={teams}
                onSubmit={(feeder) => {
                  dispatch(feedersActions.update(feeder)).then(() =>
                    navigate("/feeders")
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
