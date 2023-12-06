import { useEffect, useState } from "react";
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Button,
  TextContent,
  Text,
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
import { global_danger_color_100 } from "@patternfly/react-tokens";
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
import { useAuth } from "auth/authContext";

const DangerZone = styled.div`
  border: 1px solid ${global_danger_color_100.value};
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
            className="pf-v5-c-form__group-label-help pf-v5-u-ml-sm"
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
            className="pf-v5-c-table pf-m-compact pf-m-grid-md"
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
                      <ProductIcon className="pf-v5-u-mr-xs" />
                      {product.name}
                    </Td>
                    <Td className="pf-v5-c-table__action">
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
    return <LoadingPage title="Team" description="Details page" />;
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
              <Button type="button" onClick={openModal} isDisabled={isUpdating}>
                <EditAltIcon className="pf-v5-u-mr-xs" />
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
              <CardLine className="pf-v5-u-p-md" field="ID" value={team.id} />
              <Divider />
              <CardLine
                className="pf-v5-u-p-md"
                field="Name"
                value={team.name}
              />
              <Divider />
              <CardLine
                className="pf-v5-u-p-md"
                field="State"
                value={team.state}
              />
              <CardLine
                className="pf-v5-u-p-md"
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
                className="pf-v5-u-p-md"
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
          <TeamMembers team={team} className="pf-v5-u-mt-lg" />
          <Card className="pf-v5-u-mt-lg">
            <CardTitle>Danger Zone</CardTitle>
            <CardBody>
              <DangerZone>
                <DangerZoneRow>
                  <div>
                    <TextContent>
                      <Text component="h2">{`Delete ${team.name} team`}</Text>
                      <Text component="p">
                        Once you delete a team, there is no going back. Please
                        be certain.
                      </Text>
                    </TextContent>
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
                        <Button variant="danger" size="sm" onClick={openModal}>
                          <TrashAltIcon className="pf-v5-u-mr-sm" />
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
          <TeamComponentsPermissions className="pf-v5-u-mt-lg" team={team} />
        </GridItem>
      </Grid>
    </MainPage>
  );
}
