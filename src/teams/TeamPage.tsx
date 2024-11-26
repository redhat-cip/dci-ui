import { useEffect, useState } from "react";
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  Content,
  CardTitle,
  Divider,
  Label,
  Skeleton,
  Switch,
  Popover,
  PageSection,
} from "@patternfly/react-core";
import { TrashAltIcon, EditAltIcon, HelpIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal, Breadcrumb, EmptyState } from "ui";
import { IProduct, ITeam } from "types";
import { useParams, useNavigate } from "react-router-dom";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import EditTeamModal from "./EditTeamModal";
import CardLine from "ui/CardLine";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { getProductIcon } from "ui/icons";
import TeamMembers from "./TeamMembers";
import TeamComponentsPermissions from "./TeamComponentsPermissions";
import {
  getProductsTeamHasAccessTo,
  useAddProductToTeamMutation,
  useDeleteTeamMutation,
  useGetTeamQuery,
  useRemoveProductFromTeamMutation,
  useUpdateTeamMutation,
} from "./teamsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useListProductsQuery } from "products/productsApi";
import { useAuth } from "auth/authSelectors";
import LoadingPageSection from "ui/LoadingPageSection";

function ProductsTeamHasAccessTo({ team }: { team: ITeam }) {
  const { data, isLoading } = useListProductsQuery();
  const [removeProductFromTeam, { isLoading: isRemoving }] =
    useRemoveProductFromTeamMutation();
  const [addProductToTeam, { isLoading: isLoadingAddProductToTeam }] =
    useAddProductToTeamMutation();

  const [productsIdsTeamHasAccessTo, setProductsIdsTeamHasAccessTo] = useState<
    IProduct[]
  >([]);

  useEffect(() => {
    if (data) {
      getProductsTeamHasAccessTo(team, data.products).then(
        setProductsIdsTeamHasAccessTo,
      );
    }
  }, [data, team]);

  if (!data) return null;

  return (
    <Card>
      <CardTitle>
        Product access
        <Popover bodyContent="If a product is checked, then the team has access to all released components of the product.">
          <Button
            type="button"
            variant="plain"
            icon={<HelpIcon />}
            aria-label="More info on product access"
            onClick={(e) => e.preventDefault()}
          />
        </Popover>
      </CardTitle>
      <CardBody>
        {isLoading ? (
          <Skeleton screenreaderText="Loading products the team has access to" />
        ) : (
          <Table variant="compact" borders={false}>
            <Thead>
              <Tr>
                <Th />
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {data.products.length === 0 && (
                <Tr>
                  <Td colSpan={-1}>
                    There is no product available. Please contact a Distributed
                    CI administrator
                  </Td>
                </Tr>
              )}
              {data.products.map((product) => {
                const ProductIcon = getProductIcon(product.name);
                return (
                  <Tr key={product.id}>
                    <Td>
                      <ProductIcon className="pf-v6-u-mr-xs" />
                      {product.name}
                    </Td>
                    <Td className="pf-v6-c-table__action">
                      <Switch
                        id={`product-${product.id}-team-${team.id}-access`}
                        aria-label={`team ${team.name} has access to ${product.name}`}
                        isChecked={productsIdsTeamHasAccessTo
                          .map((p) => p.id)
                          .includes(product.id)}
                        isDisabled={isRemoving || isLoadingAddProductToTeam}
                        onChange={(e, hasAccessToProduct) => {
                          if (hasAccessToProduct) {
                            setProductsIdsTeamHasAccessTo([
                              ...productsIdsTeamHasAccessTo,
                              product,
                            ]);
                            addProductToTeam({ team, product });
                          } else {
                            setProductsIdsTeamHasAccessTo(
                              productsIdsTeamHasAccessTo.filter(
                                (p) => p.id !== product.id,
                              ),
                            );
                            removeProductFromTeam({ team, product });
                          }
                        }}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}

export default function TeamPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { team_id } = useParams();
  const { data: team, isLoading } = useGetTeamQuery(
    team_id ? team_id : skipToken,
  );
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (currentUser === null) return null;

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
              <Divider />
              <CardLine
                className="pf-v6-u-p-md"
                field="Name"
                value={team.name}
              />
              <Divider />
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
                    variant="danger"
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
