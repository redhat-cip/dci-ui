import {
  Grid,
  GridItem,
  Card,
  CardBody,
  PageSection,
  Content,
} from "@patternfly/react-core";
import CreateFeederForm from "./CreateFeederForm";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, EmptyState } from "ui";
import { useListTeamsQuery } from "teams/teamsApi";
import { useCreateFeederMutation } from "feeders/feedersApi";
import LoadingPageSection from "ui/LoadingPageSection";

export default function CreateFeederPage() {
  const [createFeeder] = useCreateFeederMutation();
  const { data: dataTeams, isLoading: isLoadingTeams } = useListTeamsQuery();
  const navigate = useNavigate();

  if (isLoadingTeams) {
    return <LoadingPageSection />;
  }

  if (!dataTeams) {
    return <EmptyState title="There is no teams" />;
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/feeders", title: "Feeders" },
          { title: "Create a feeder" },
        ]}
      />
      <Content component="h1">Create a feeder</Content>
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
    </PageSection>
  );
}
