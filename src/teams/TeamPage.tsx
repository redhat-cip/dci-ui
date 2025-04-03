import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  Content,
  CardTitle,
  Label,
  PageSection,
} from "@patternfly/react-core";
import { TrashAltIcon, EditAltIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal, Breadcrumb, EmptyState } from "ui";
import { useParams, useNavigate } from "react-router";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import EditTeamModal from "./EditTeamModal";
import CardLine from "ui/CardLine";
import TeamMembers from "./TeamMembers";
import TeamComponentsPermissions from "./TeamComponentsPermissions";
import {
  useDeleteTeamMutation,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from "./teamsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";
import ProductsTeamHasAccessTo from "./ProductsTeamHasAccessTo";

export default function TeamPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { team_id } = useParams();
  const { data: team, isLoading } = useGetTeamQuery(
    team_id ? team_id : skipToken,
  );
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();

  if (currentUser === null) return null;

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!team) {
    return <EmptyState title="No team" info={`Team ${team_id} not found`} />;
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/teams", title: "Teams" },
          { to: `/teams/${team_id}`, title: team_id },
        ]}
      />
      <Content component="h1">{`Team ${team.name}`}</Content>
      <Content component="p">
        {team ? `Details page for team ${team.name}` : "Details page"}
      </Content>
      {currentUser.isSuperAdmin && (
        <div className="pf-v6-u-mb-md">
          <EditTeamModal team={team} onSubmit={updateTeam}>
            {(openModal) => (
              <Button
                icon={<EditAltIcon className="pf-v6-u-mr-xs" />}
                type="button"
                onClick={openModal}
                isDisabled={isUpdating}
              >
                {`edit ${team.name} team`}
              </Button>
            )}
          </EditTeamModal>
        </div>
      )}
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardTitle>Team information</CardTitle>
            <CardBody>
              <CardLine className="pf-v6-u-p-md" field="ID" value={team.id} />
              <CardLine
                className="pf-v6-u-p-md"
                field="Name"
                value={team.name}
              />
              <CardLine
                className="pf-v6-u-p-md"
                field="State"
                value={team.state}
              />
              <CardLine
                className="pf-v6-u-p-md"
                field="Partner"
                value={
                  team.external ? (
                    <Label color="green">yes</Label>
                  ) : (
                    <Label color="red">no</Label>
                  )
                }
              />
              <CardLine
                className="pf-v6-u-p-md"
                field="Has access to pre release content"
                value={
                  team.has_pre_release_access ? (
                    <Label color="green">yes</Label>
                  ) : (
                    <Label color="red">no</Label>
                  )
                }
              />
            </CardBody>
          </Card>
          <TeamMembers team={team} className="pf-v6-u-mt-lg" />
          <Card className="pf-v6-u-mt-lg">
            <CardTitle>
              <span
                style={{ color: t_global_color_status_danger_default.value }}
              >
                {`Delete ${team.name} team`}
              </span>
            </CardTitle>
            <CardBody>
              <Content
                component="p"
                style={{ color: t_global_color_status_danger_default.value }}
              >
                Once you delete a team, there is no going back. Please be
                certain.
              </Content>

              <ConfirmDeleteModal
                title={`Delete team ${team.name}`}
                message={`Are you sure you want to delete ${team.name} team?`}
                onOk={() => deleteTeam(team).then(() => navigate("/teams"))}
              >
                {(openModal) => (
                  <Button
                    icon={<TrashAltIcon className="pf-v6-u-mr-sm" />}
                    variant="secondary"
                    isDanger
                    onClick={openModal}
                  >
                    Delete this team
                  </Button>
                )}
              </ConfirmDeleteModal>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <ProductsTeamHasAccessTo team={team} />
          <TeamComponentsPermissions className="pf-v6-u-mt-lg" team={team} />
        </GridItem>
      </Grid>
    </PageSection>
  );
}
