import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import CreateFeederForm from "./CreateFeederForm";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "ui";
import { useListTeamsQuery } from "teams/teamsApi";
import { useCreateFeederMutation } from "feeders/feedersApi";

export default function CreateFeederPage() {
  const [createFeeder, { isLoading: isCreating }] = useCreateFeederMutation();
  const { data: dataTeams, isLoading: isLoadingTeams } = useListTeamsQuery();
  const navigate = useNavigate();

  if (!dataTeams) return null;

  return (
    <MainPage
      title="Create a feeder"
      description=""
      isLoading={isLoadingTeams || isCreating}
      Breadcrumb={
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
                teams={dataTeams.teams}
                onSubmit={(feeder) => {
                  createFeeder(feeder).then(() => navigate("/feeders"));
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </MainPage>
  );
}
