import {
  Grid,
  GridItem,
  Card,
  CardBody,
  PageSection,
  Content,
} from "@patternfly/react-core";
import EditFeederForm from "./EditFeederForm";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, EmptyState } from "ui";
import { useListTeamsQuery } from "teams/teamsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetFeederQuery, useUpdateFeederMutation } from "feeders/feedersApi";
import LoadingPageSection from "ui/LoadingPageSection";

export default function EditFeederPage() {
  const navigate = useNavigate();
  const { feeder_id } = useParams();
  const { data: feeder, isLoading } = useGetFeederQuery(
    feeder_id ? feeder_id : skipToken,
  );
  const [updateFeeder] = useUpdateFeederMutation();
  const { data: dataTeam, isLoading: isLoadingTeams } = useListTeamsQuery();

  if (isLoading || isLoadingTeams) {
    return <LoadingPageSection />;
  }

  if (!feeder) {
    return <EmptyState title="There is no feeder" />;
  }

  if (!dataTeam) {
    return <EmptyState title="There is no teams" />;
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/feeders", title: "Feeders" },
          { to: `/feeders/${feeder_id}`, title: feeder_id },
        ]}
      />
      <Content component="h1">Edit a feeder</Content>
      <Content component="p">
        A feeder is a script in charge of uploading newer versions of components
        to the control server
      </Content>
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
    </PageSection>
  );
}
