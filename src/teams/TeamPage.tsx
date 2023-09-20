import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import teamsActions, {
  getProductsTeamHasAccessTo,
  fetchUsersForTeam,
  grantTeamProductPermission,
  removeTeamProductPermission,
} from "./teamsActions";
import {
  TrashAltIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  EditAltIcon,
  HelpIcon,
} from "@patternfly/react-icons";
import { ConfirmDeleteModal, Breadcrumb, CopyButton } from "ui";
import { AppDispatch } from "store";
import { ITeam, IUser } from "types";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { global_danger_color_100 } from "@patternfly/react-tokens";
import { addUserToTeam, deleteUserFromTeam } from "users/usersActions";
import AddUserToTeamModal from "./AddUserToTeamModal";
import { getCurrentUser } from "currentUser/currentUserSelectors";
import EditTeamModal from "./EditTeamModal";
import CardLine from "ui/CardLine";
import { sortByName } from "services/sort";
import { showError, showSuccess } from "alerts/alertsActions";
import MainPage from "pages/MainPage";
import LoadingPage from "pages/LoadingPage";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { getTeamById } from "./teamsSelectors";
import { getProducts } from "products/productsSelectors";
import { getProductIcon } from "ui/icons";

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

export default function TeamPage() {
  const currentUser = useSelector(getCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [teamUsers, setTeamUsers] = useState<IUser[]>([]);
  const { team_id } = useParams();
  const team = useSelector(getTeamById(team_id));
  const products = useSelector(getProducts);
  const [productsIdsTeamHasAccessTo, setProductsIdsTeamHasAccessTo] = useState<
    string[]
  >([]);

  const _fetchTeamUsers = useCallback(
    (id: string) => {
      Promise.all([
        fetchUsersForTeam({ id } as ITeam),
        dispatch(getProductsTeamHasAccessTo({ id } as ITeam)),
      ])
        .then((response) => {
          setTeamUsers(response[0]);
          setProductsIdsTeamHasAccessTo(response[1].map((p) => p.id));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [dispatch],
  );

  useEffect(() => {
    if (team_id) {
      dispatch(teamsActions.one(team_id));
    }
  }, [team_id, dispatch]);

  useEffect(() => {
    if (team_id) {
      _fetchTeamUsers(team_id);
    }
  }, [team_id, _fetchTeamUsers]);

  if (!team_id) return null;

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
      Breadcrumb={breadcrumb}
      HeaderButton={
        currentUser?.isSuperAdmin && team ? (
          <EditTeamModal
            team={team}
            onSubmit={(team) => dispatch(teamsActions.update(team))}
          >
            {(openModal) => (
              <Button type="button" onClick={openModal}>
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
                field="Members"
                value={isLoading ? "" : teamUsers.length}
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
          <Card className="pf-v5-u-mt-lg">
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
                    {products.map((product) => {
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
                              isChecked={productsIdsTeamHasAccessTo.includes(
                                product.id,
                              )}
                              onChange={(e, hasAccessToProduct) => {
                                if (hasAccessToProduct) {
                                  setProductsIdsTeamHasAccessTo([
                                    ...productsIdsTeamHasAccessTo,
                                    product.id,
                                  ]);
                                  dispatch(
                                    grantTeamProductPermission(team, product),
                                  );
                                } else {
                                  setProductsIdsTeamHasAccessTo(
                                    productsIdsTeamHasAccessTo.filter(
                                      (id) => id !== product.id,
                                    ),
                                  );
                                  dispatch(
                                    removeTeamProductPermission(team, product),
                                  );
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
                        dispatch(teamsActions.delete(team)).then(() =>
                          navigate("/teams"),
                        )
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
          <Card>
            <CardTitle>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>Team members</div>
                <div>
                  <AddUserToTeamModal
                    team={team}
                    onUserSelected={(user) => {
                      const fullname = user.fullname;
                      addUserToTeam(user.id, team)
                        .then((response) => {
                          _fetchTeamUsers(team.id);
                          dispatch(
                            showSuccess(
                              `${fullname} added successfully to ${team.name} team.`,
                            ),
                          );
                          return response;
                        })
                        .catch((error) => {
                          dispatch(
                            showError(
                              `We can't add ${fullname} user to ${team.name} team`,
                            ),
                          );
                          return error;
                        });
                    }}
                  >
                    {(openModal) => (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={openModal}
                      >
                        <PlusCircleIcon className="pf-v5-u-mr-xs" />
                        Add a user
                      </Button>
                    )}
                  </AddUserToTeamModal>
                </div>
              </div>
            </CardTitle>
            <CardBody>
              {isLoading ? (
                <Skeleton screenreaderText="Loading team's users" />
              ) : (
                <Table className="pf-v5-c-table pf-m-compact pf-m-grid-md">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Login</Th>
                      <Th>Full name</Th>
                      <Th>Email</Th>
                      <Th />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortByName(teamUsers).map((user) => (
                      <Tr key={user.id}>
                        <Td>
                          <CopyButton text={user.id} />
                        </Td>
                        <Td>
                          <Link to={`/users/${user.id}`}>{user.name}</Link>
                        </Td>
                        <Td>{user.fullname}</Td>
                        <Td>{user.email}</Td>
                        <Td className="pf-v5-c-table__action">
                          <ConfirmDeleteModal
                            title={`Delete ${user.name} from ${team.name}`}
                            message={`Are you sure you want to remove user ${user.name} from team ${team.name}?`}
                            onOk={() => {
                              deleteUserFromTeam(user, team).then(() => {
                                _fetchTeamUsers(team_id);
                              });
                            }}
                          >
                            {(openModal) => (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={openModal}
                              >
                                <MinusCircleIcon />
                              </Button>
                            )}
                          </ConfirmDeleteModal>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </MainPage>
  );
}
