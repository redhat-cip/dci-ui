import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import EditFeederForm from "./EditFeederForm";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "ui";
import LoadingPage from "pages/LoadingPage";
import { useListTeamsQuery } from "teams/teamsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetFeederQuery, useUpdateFeederMutation } from "feeders/feedersApi";

export default function EditFeederPage() {
  const navigate = useNavigate();
  const { feeder_id } = useParams();
  const { data: feeder, isLoading } = useGetFeederQuery(
    feeder_id ? feeder_id : skipToken,
  );
  const [updateFeeder] = useUpdateFeederMutation();
  const { data: dataTeam, isLoading: isLoadingTeams } = useListTeamsQuery();

  const breadcrumb = (
    <Breadcrumb
      links={[
        { to: "/", title: "DCI" },
        { to: "/feeders", title: "Feeders" },
        { to: `/feeders/${feeder_id}`, title: feeder_id },
      ]}
    />
  );

  if (feeder === null) {
    return <LoadingPage title="Edit a feeder" Breadcrumb={breadcrumb} />;
  }

  return (
    <MainPage
      title="Edit a feeder"
      description="A feeder is a script in charge of uploading newer versions of components to the control server."
      Breadcrumb={breadcrumb}
      isLoading={isLoading || isLoadingTeams}
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              {!feeder || !dataTeam ? null : (
                <EditFeederForm
                  feeder={feeder}
                  teams={dataTeam.teams}
                  onSubmit={(feeder) => {
                    updateFeeder(feeder).then(() => navigate("/feeders"));
                  }}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </MainPage>
  );
}
