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
} from "@patternfly/react-core";
import { TrashAltIcon, EditAltIcon, HelpIcon } from "@patternfly/react-icons";
import { ConfirmDeleteModal, Breadcrumb } from "ui";
import { IProduct, ITeam } from "types";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { t_global_color_nonstatus_red_200 } from "@patternfly/react-tokens";
import EditTeamModal from "./EditTeamModal";
import CardLine from "ui/CardLine";
import MainPage from "pages/MainPage";
import LoadingPage from "pages/LoadingPage";
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

const DangerZone = styled.div`
  border: 1px solid ${t_global_color_nonstatus_red_200.value};
  padding: 1rem;
  border-radius: 0.5rem;
`;

const DangerZoneRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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
          <button
            type="button"
            aria-label="More info on product access"
            onClick={(e) => e.preventDefault()}
            className="pf-v6-c-form__group-label-help pf-v6-u-ml-sm"
          >
            <HelpIcon />
          </button>
        </Popover>
      </CardTitle>
      <CardBody>
        {isLoading ? (
          <Skeleton screenreaderText="Loading products the team has access to" />
        ) : (
          <Table
            variant="compact"
            className="pf-v6-c-tablepf-m-grid-md"
            style={{ maxWidth: 400 }}
          >
            <Thead>
              <Tr>
                <Th />
                <Th />
              </Tr>
            </Thead>
            <Tbody>
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

  if (!team_id || !team) return null;

  const breadcrumb = (
    <Breadcrumb
      links={[
        { to: "/", title: "DCI" },
        { to: "/teams", title: "Teams" },
        { to: `/teams/${team_id}`, title: team_id },
      ]}
    />
  );

  if (team === null) {
    return <LoadingPage />;
  }

  return (
    <MainPage
      title={`Team ${team.name}`}
      description={team ? `Details page for team ${team.name}` : "Details page"}
      isLoading={isLoading}
      Breadcrumb={breadcrumb}
      HeaderButton={
        currentUser?.isSuperAdmin && team ? (
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
        ) : null
      }
    >
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
            <CardTitle>Danger Zone</CardTitle>
            <CardBody>
              <DangerZone>
                <DangerZoneRow>
                  <div>
                    <Content>
                      <Content component="h2">{`Delete ${team.name} team`}</Content>
                      <Content component="p">
                        Once you delete a team, there is no going back. Please
                        be certain.
                      </Content>
                    </Content>
                  </div>
                  <div>
                    <ConfirmDeleteModal
                      title={`Delete team ${team.name}`}
                      message={`Are you sure you want to delete ${team.name} team?`}
                      onOk={() =>
                        deleteTeam(team).then(() => navigate("/teams"))
                      }
                    >
                      {(openModal) => (
                        <Button
                          icon={<TrashAltIcon className="pf-v6-u-mr-sm" />}
                          variant="danger"
                          size="sm"
                          onClick={openModal}
                        >
                          Delete this team
                        </Button>
                      )}
                    </ConfirmDeleteModal>
                  </div>
                </DangerZoneRow>
              </DangerZone>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <ProductsTeamHasAccessTo team={team} />
          <TeamComponentsPermissions className="pf-v6-u-mt-lg" team={team} />
        </GridItem>
      </Grid>
    </MainPage>
  );
}
